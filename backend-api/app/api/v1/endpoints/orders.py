from decimal import Decimal
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_user_payload, check_role
from app.models.models import (
    Pedido, DetallePedido, HistorialEstadoPedido, Producto,
    Consumidor, Productor, EstadoPedido, Calificacion,
    ProductorOpcionEntrega
)
from app.schemas.schemas import (
    PedidoCreate, PedidoResponse, DetallePedidoResponse,
    CambioEstadoPedido, CalificacionCreate, CalificacionResponse
)

router = APIRouter()

@router.post("", response_model=PedidoResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order_in: PedidoCreate,
    payload: dict = Depends(check_role(required_role_id=3)),
    db: AsyncSession = Depends(get_db)
):
    """RF-CON-06 / OBJ-API-05: Generar pedido para un productor con cálculo de subtotales históricos"""
    user_id = int(payload.get("sub"))
    cons_stmt = select(Consumidor).where(Consumidor.id_usuario == user_id)
    c_res = await db.execute(cons_stmt)
    consumidor = c_res.scalars().first()
    if not consumidor:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Perfil de consumidor no encontrado")

    # Verificar costo de envío de la opción seleccionada
    envio_stmt = select(ProductorOpcionEntrega).where(
        and_(
            ProductorOpcionEntrega.id_productor == order_in.id_productor,
            ProductorOpcionEntrega.id_opcion == order_in.id_opcion
        )
    )
    env_res = await db.execute(envio_stmt)
    opcion_envio = env_res.scalars().first()
    costo_envio = opcion_envio.costo_envio if opcion_envio else Decimal("0.00")

    # Validar existencias y calcular subtotales
    total = costo_envio
    detalles_a_crear = []

    for item in order_in.items:
        prod_stmt = select(Producto).where(Producto.id_producto == item.id_producto)
        p_res = await db.execute(prod_stmt)
        producto = p_res.scalars().first()

        if not producto or producto.id_productor != order_in.id_productor:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El producto con ID {item.id_producto} no pertenece al productor especificado"
            )

        if producto.estado != "publicado":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"El producto '{producto.nombre}' no se encuentra disponible actualmente"
            )

        if producto.cantidad_disponible < item.cantidad:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Existencias insuficientes para '{producto.nombre}'. Disponibles: {producto.cantidad_disponible}"
            )

        subtotal = Decimal(str(item.cantidad)) * Decimal(str(producto.precio))
        total += subtotal

        detalles_a_crear.append({
            "id_producto": producto.id_producto,
            "cantidad": item.cantidad,
            "precio_unitario": producto.precio,
            "subtotal": subtotal,
            "nombre": producto.nombre
        })

    # Crear Pedido
    nuevo_pedido = Pedido(
        id_consumidor=consumidor.id_consumidor,
        id_productor=order_in.id_productor,
        id_opcion=order_in.id_opcion,
        id_estado=1, # 'pendiente'
        total=total,
        direccion_entrega=order_in.direccion_entrega
    )
    db.add(nuevo_pedido)
    await db.flush()

    # Guardar detalles y registrar en historial
    detalles_resp = []
    for d in detalles_a_crear:
        det = DetallePedido(
            id_pedido=nuevo_pedido.id_pedido,
            id_producto=d["id_producto"],
            cantidad=d["cantidad"],
            precio_unitario=d["precio_unitario"],
            subtotal=d["subtotal"]
        )
        db.add(det)
        await db.flush()
        detalles_resp.append(DetallePedidoResponse(
            id_detalle=det.id_detalle,
            id_producto=det.id_producto,
            nombre_producto=d["nombre"],
            cantidad=det.cantidad,
            precio_unitario=det.precio_unitario,
            subtotal=det.subtotal
        ))

    # Historial de creación (estado 1)
    historial = HistorialEstadoPedido(
        id_pedido=nuevo_pedido.id_pedido,
        id_estado=1,
        id_usuario=user_id
    )
    db.add(historial)

    await db.commit()
    await db.refresh(nuevo_pedido)

    resp = PedidoResponse.from_orm(nuevo_pedido)
    resp.nombre_estado = "pendiente"
    resp.detalles = detalles_resp
    return resp

@router.patch("/{id_pedido}/status", response_model=PedidoResponse)
async def update_order_status(
    id_pedido: int,
    status_in: CambioEstadoPedido,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    """RF-PRO-08 / RF-PRO-09: Aceptar, rechazar y actualizar estado del pedido"""
    user_id = int(payload.get("sub"))
    role_id = int(payload.get("role_id"))

    stmt = select(Pedido).options(selectinload(Pedido.detalles)).where(Pedido.id_pedido == id_pedido)
    res = await db.execute(stmt)
    pedido = res.scalars().first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

    # Si pasa a 'aceptado' (id 2), descontar existencias de productos
    if status_in.id_estado == 2 and pedido.id_estado == 1:
        for d in pedido.detalles:
            p_stmt = select(Producto).where(Producto.id_producto == d.id_producto)
            p_res = await db.execute(p_stmt)
            p = p_res.scalars().first()
            if p:
                if p.cantidad_disponible < d.cantidad:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Stock insuficiente para aceptar el pedido en '{p.nombre}'"
                    )
                p.cantidad_disponible -= d.cantidad

    pedido.id_estado = status_in.id_estado
    if status_in.motivo_rechazo:
        pedido.motivo_rechazo = status_in.motivo_rechazo

    # Registrar en bitácora de historial
    hist = HistorialEstadoPedido(
        id_pedido=pedido.id_pedido,
        id_estado=status_in.id_estado,
        id_usuario=user_id
    )
    db.add(hist)

    await db.commit()
    await db.refresh(pedido)
    return pedido

@router.get("/history/me", response_model=List[PedidoResponse])
async def get_my_order_history(
    payload: dict = Depends(check_role(required_role_id=3)),
    db: AsyncSession = Depends(get_db)
):
    """RF-CON-07 / RF-CON-08: Historial y seguimiento de pedidos del consumidor"""
    user_id = int(payload.get("sub"))
    cons_stmt = select(Consumidor).where(Consumidor.id_usuario == user_id)
    c_res = await db.execute(cons_stmt)
    consumidor = c_res.scalars().first()
    if not consumidor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado")

    stmt = select(Pedido).options(
        selectinload(Pedido.detalles),
        selectinload(Pedido.estado),
        selectinload(Pedido.productor)
    ).where(Pedido.id_consumidor == consumidor.id_consumidor).order_by(Pedido.fecha_pedido.desc())

    res = await db.execute(stmt)
    pedidos = res.scalars().all()

    output = []
    for p in pedidos:
        item = PedidoResponse.from_orm(p)
        item.nombre_estado = p.estado.nombre if p.estado else None
        item.nombre_negocio_productor = p.productor.nombre_negocio if p.productor else None
        output.append(item)
    return output

@router.post("/{id_pedido}/reviews", response_model=CalificacionResponse, status_code=status.HTTP_201_CREATED)
async def review_order(
    id_pedido: int,
    review_in: CalificacionCreate,
    payload: dict = Depends(check_role(required_role_id=3)),
    db: AsyncSession = Depends(get_db)
):
    """RF-CON-09: Calificar producto o transacción una vez entregado el pedido"""
    user_id = int(payload.get("sub"))
    cons_stmt = select(Consumidor).where(Consumidor.id_usuario == user_id)
    c_res = await db.execute(cons_stmt)
    consumidor = c_res.scalars().first()

    stmt = select(Pedido).where(Pedido.id_pedido == id_pedido)
    p_res = await db.execute(stmt)
    pedido = p_res.scalars().first()
    if not pedido:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pedido no encontrado")

    if pedido.id_estado != 5: # 5 = entregado
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo se pueden calificar pedidos que hayan sido marcados como 'entregado'."
        )

    nueva_calif = Calificacion(
        id_pedido=id_pedido,
        id_producto=review_in.id_producto,
        id_consumidor=consumidor.id_consumidor,
        puntuacion=review_in.puntuacion,
        comentario=review_in.comentario
    )
    db.add(nueva_calif)
    await db.commit()
    await db.refresh(nueva_calif)
    return nueva_calif
