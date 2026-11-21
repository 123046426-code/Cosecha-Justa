from decimal import Decimal
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_user_payload, check_role
from app.models.models import (
    Productor, Pedido, DetallePedido, ProductorOpcionEntrega,
    OpcionEntrega, Producto, Usuario
)
from app.schemas.schemas import (
    ProductorResponse, ProductorBase,
    EstadisticasProductorResponse, ProductorOpcionEntregaItem,
    PedidoResponse
)

router = APIRouter()

@router.get("", response_model=List[ProductorResponse])
async def list_producers(db: AsyncSession = Depends(get_db)):
    """RF-CON-03: Lista pública de productores validados en la plataforma"""
    stmt = select(Productor).where(Productor.estatus_validacion == "validado")
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/me", response_model=ProductorResponse)
async def get_my_producer_profile(
    payload: dict = Depends(check_role(required_role_id=2)),
    db: AsyncSession = Depends(get_db)
):
    """RF-PRO-02: Consultar datos del perfil de productor"""
    user_id = int(payload.get("sub"))
    stmt = select(Productor).where(Productor.id_usuario == user_id)
    res = await db.execute(stmt)
    prod = res.scalars().first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado")
    return prod

@router.put("/me", response_model=ProductorResponse)
async def update_my_producer_profile(
    profile_in: ProductorBase,
    payload: dict = Depends(check_role(required_role_id=2)),
    db: AsyncSession = Depends(get_db)
):
    """RF-PRO-02: Editar datos del negocio del productor"""
    user_id = int(payload.get("sub"))
    stmt = select(Productor).where(Productor.id_usuario == user_id)
    res = await db.execute(stmt)
    prod = res.scalars().first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado")

    prod.nombre_negocio = profile_in.nombre_negocio
    prod.descripcion = profile_in.descripcion
    prod.municipio = profile_in.municipio
    prod.estado = profile_in.estado

    await db.commit()
    await db.refresh(prod)
    return prod

@router.put("/me/delivery-options")
async def update_producer_delivery_options(
    options: List[ProductorOpcionEntregaItem],
    payload: dict = Depends(check_role(required_role_id=2)),
    db: AsyncSession = Depends(get_db)
):
    """RF-PRO-11: Administrar las opciones de entrega ofrecidas y sus costos"""
    user_id = int(payload.get("sub"))
    stmt = select(Productor).where(Productor.id_usuario == user_id)
    res = await db.execute(stmt)
    prod = res.scalars().first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado")

    # Eliminar opciones anteriores
    stmt_del = select(ProductorOpcionEntrega).where(ProductorOpcionEntrega.id_productor == prod.id_productor)
    existing = await db.execute(stmt_del)
    for row in existing.scalars().all():
        await db.delete(row)

    # Insertar nuevas opciones
    for opt in options:
        item = ProductorOpcionEntrega(
            id_productor=prod.id_productor,
            id_opcion=opt.id_opcion,
            costo_envio=opt.costo_envio
        )
        db.add(item)

    await db.commit()
    return {"message": "Opciones de entrega actualizadas con éxito"}

@router.get("/me/statistics", response_model=EstadisticasProductorResponse)
async def get_producer_statistics(
    payload: dict = Depends(check_role(required_role_id=2)),
    db: AsyncSession = Depends(get_db)
):
    """RF-PRO-10: Resumen de ventas, pedidos y productos más solicitados"""
    user_id = int(payload.get("sub"))
    prod_stmt = select(Productor).where(Productor.id_usuario == user_id)
    res = await db.execute(prod_stmt)
    prod = res.scalars().first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado")

    # Total pedidos y ventas
    totales_stmt = select(
        func.count(Pedido.id_pedido),
        func.coalesce(func.sum(Pedido.total), Decimal("0.00"))
    ).where(Pedido.id_productor == prod.id_productor)
    totales_res = await db.execute(totales_stmt)
    total_pedidos, total_monto = totales_res.first()

    # Pedidos pendientes (estado = 1)
    pendientes_stmt = select(func.count(Pedido.id_pedido)).where(
        and_(Pedido.id_productor == prod.id_productor, Pedido.id_estado == 1)
    )
    pendientes_res = await db.execute(pendientes_stmt)
    pedidos_pendientes = pendientes_res.scalar() or 0

    # Pedidos entregados (estado = 5)
    entregados_stmt = select(func.count(Pedido.id_pedido)).where(
        and_(Pedido.id_productor == prod.id_productor, Pedido.id_estado == 5)
    )
    entregados_res = await db.execute(entregados_stmt)
    pedidos_entregados = entregados_res.scalar() or 0

    # Productos más vendidos
    top_stmt = select(
        Producto.nombre,
        func.sum(DetallePedido.cantidad).label("total_vendido")
    ).join(DetallePedido.producto).join(DetallePedido.pedido).where(
        Pedido.id_productor == prod.id_productor
    ).group_by(Producto.nombre).order_by(func.sum(DetallePedido.cantidad).desc()).limit(5)
    top_res = await db.execute(top_stmt)
    top_productos = [{"producto": row[0], "cantidad_vendida": float(row[1])} for row in top_res.all()]

    return EstadisticasProductorResponse(
        total_ventas_monto=Decimal(str(total_monto)),
        total_pedidos=total_pedidos,
        pedidos_pendientes=pedidos_pendientes,
        pedidos_completados=pedidos_entregados,
        productos_mas_vendidos=top_productos
    )
