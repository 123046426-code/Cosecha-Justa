from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import check_role, get_current_user_payload
from app.models.models import (
    Usuario, Productor, Consumidor, Producto, Pedido,
    Incidencia, Categoria, EstadoPedido, DetallePedido
)
from app.schemas.schemas import (
    EstadisticasAdminResponse, ProductorResponse,
    UsuarioResponse, CategoriaCreate, CategoriaUpdate, CategoriaResponse,
    IncidenciaResponse, IncidenciaUpdate,
    AdminOrderResponse, AdminReportSalesResponse
)

router = APIRouter()

@router.get("/dashboard", response_model=EstadisticasAdminResponse)
async def get_admin_dashboard(
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-07: Métricas y estadísticas generales de la operación para el Administrador"""
    total_users = (await db.execute(select(func.count(Usuario.id_usuario)))).scalar() or 0
    total_producers = (await db.execute(select(func.count(Productor.id_productor)))).scalar() or 0
    total_consumers = (await db.execute(select(func.count(Consumidor.id_consumidor)))).scalar() or 0
    active_products = (await db.execute(select(func.count(Producto.id_producto)).where(Producto.estado == "publicado"))).scalar() or 0
    total_orders = (await db.execute(select(func.count(Pedido.id_pedido)))).scalar() or 0
    total_revenue = (await db.execute(select(func.coalesce(func.sum(Pedido.total), Decimal("0.00"))))).scalar() or Decimal("0.00")
    open_incidents = (await db.execute(select(func.count(Incidencia.id_incidencia)).where(Incidencia.estado != "resuelta"))).scalar() or 0

    return EstadisticasAdminResponse(
        total_usuarios=total_users,
        total_productores=total_producers,
        total_consumidores=total_consumers,
        total_productos_activos=active_products,
        total_pedidos_global=total_orders,
        monto_total_transacciones=total_revenue,
        incidencias_abiertas=open_incidents
    )

@router.get("/producers", response_model=List[ProductorResponse])
async def list_all_producers(
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-03: Consultar productores registrados y estado de validación"""
    stmt = select(Productor).order_by(Productor.id_productor.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.patch("/producers/{id_productor}/validate")
async def validate_producer(
    id_productor: int,
    estatus: str,
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-03: Validar o rechazar un productor para autorizar venta en la plataforma"""
    if estatus not in ["validado", "rechazado", "pendiente"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Estatus no válido")

    stmt = select(Productor).where(Productor.id_productor == id_productor)
    res = await db.execute(stmt)
    prod = res.scalars().first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Productor no encontrado")

    prod.estatus_validacion = estatus
    await db.commit()
    return {"message": f"Productor actualizado a '{estatus}'", "id_productor": id_productor}

@router.get("/users", response_model=List[UsuarioResponse])
async def list_users(
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-02: Gestionar y consultar usuarios"""
    stmt = select(Usuario).order_by(Usuario.id_usuario.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.patch("/users/{id_usuario}/status")
async def toggle_user_active(
    id_usuario: int,
    activo: bool,
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-02: Activar o desactivar usuarios (borrado lógico)"""
    stmt = select(Usuario).where(Usuario.id_usuario == id_usuario)
    res = await db.execute(stmt)
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    user.activo = activo
    await db.commit()
    return {"message": f"Usuario {'activado' if activo else 'desactivado'}", "id_usuario": id_usuario}

@router.post("/categories", response_model=CategoriaResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    cat_in: CategoriaCreate,
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-04: Gestionar categorías de productos"""
    cat = Categoria(
        nombre=cat_in.nombre,
        tipo_sector=cat_in.tipo_sector,
        activa=cat_in.activa
    )
    db.add(cat)
    await db.commit()
    await db.refresh(cat)
    return cat

@router.patch("/products/{id_producto}/retire")
async def retire_product(
    id_producto: int,
    motivo: str,
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-05: Retirar del catálogo productos que incumplan normativas"""
    stmt = select(Producto).where(Producto.id_producto == id_producto)
    res = await db.execute(stmt)
    prod = res.scalars().first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

    prod.estado = "retirado"
    prod.motivo_retiro = motivo
    await db.commit()
    return {"message": "Producto retirado exitosamente", "motivo": motivo}

@router.get("/incidents", response_model=List[IncidenciaResponse])
async def list_incidents(
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-08: Consultar incidencias y quejas reportadas"""
    stmt = select(Incidencia).order_by(Incidencia.fecha_reporte.desc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.patch("/incidents/{id_incidencia}", response_model=IncidenciaResponse)
async def update_incident(
    id_incidencia: int,
    inc_in: IncidenciaUpdate,
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-08: Atender y dar resolución a incidencias"""
    user_id = int(payload.get("sub"))
    stmt = select(Incidencia).where(Incidencia.id_incidencia == id_incidencia)
    res = await db.execute(stmt)
    inc = res.scalars().first()
    if not inc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Incidencia no encontrada")

    inc.estado = inc_in.estado
    inc.resolucion = inc_in.resolucion
    inc.id_admin_atiende = user_id

    await db.commit()
    await db.refresh(inc)
    return inc

@router.get("/categories", response_model=List[CategoriaResponse])
async def list_admin_categories(
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-04: Lista completa de categorías para administración"""
    stmt = select(Categoria).order_by(Categoria.id_categoria.asc())
    res = await db.execute(stmt)
    return res.scalars().all()

@router.patch("/categories/{id_categoria}", response_model=CategoriaResponse)
async def update_category(
    id_categoria: int,
    cat_in: CategoriaUpdate,
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-04: Actualizar nombre, sector o activar/desactivar categoría"""
    stmt = select(Categoria).where(Categoria.id_categoria == id_categoria)
    res = await db.execute(stmt)
    cat = res.scalars().first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")

    if cat_in.nombre is not None:
        cat.nombre = cat_in.nombre
    if cat_in.tipo_sector is not None:
        cat.tipo_sector = cat_in.tipo_sector
    if cat_in.activa is not None:
        cat.activa = cat_in.activa

    await db.commit()
    await db.refresh(cat)
    return cat

@router.get("/orders", response_model=List[AdminOrderResponse])
async def list_admin_orders(
    estado_id: Optional[int] = Query(None, description="Filtrar por estado de pedido"),
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-06: Monitoreo global de pedidos en curso y cerrados"""
    query = select(Pedido).options(
        selectinload(Pedido.consumidor).selectinload(Consumidor.usuario),
        selectinload(Pedido.productor),
        selectinload(Pedido.estado),
        selectinload(Pedido.detalles)
    ).order_by(desc(Pedido.fecha_pedido))

    if estado_id:
        query = query.where(Pedido.id_estado == estado_id)

    res = await db.execute(query)
    pedidos = res.scalars().all()

    output = []
    for p in pedidos:
        nombre_cons = f"{p.consumidor.usuario.nombre} {p.consumidor.usuario.apellidos}" if (p.consumidor and p.consumidor.usuario) else "Consumidor"
        nombre_prod = p.productor.nombre_negocio if p.productor else "Productor"
        total_items = sum([d.cantidad for d in p.detalles]) if p.detalles else 0

        output.append(AdminOrderResponse(
            id_pedido=p.id_pedido,
            id_consumidor=p.id_consumidor,
            nombre_consumidor=nombre_cons,
            id_productor=p.id_productor,
            nombre_negocio_productor=nombre_prod,
            id_estado=p.id_estado,
            nombre_estado=p.estado.nombre if p.estado else "desconocido",
            total=p.total,
            direccion_entrega=p.direccion_entrega,
            fecha_pedido=p.fecha_pedido,
            motivo_rechazo=p.motivo_rechazo,
            total_productos=int(total_items)
        ))
    return output

@router.get("/reports/sales", response_model=AdminReportSalesResponse)
async def get_sales_report(
    payload: dict = Depends(check_role(required_role_id=1)),
    db: AsyncSession = Depends(get_db)
):
    """RF-ADM-07: Reporte consolidado de volumen comercial, sector y top productores"""
    # Total ventas y pedidos entregados (id_estado = 5)
    entregados_stmt = select(
        func.coalesce(func.sum(Pedido.total), Decimal("0.00")),
        func.count(Pedido.id_pedido)
    ).where(Pedido.id_estado == 5)
    res_entregados = (await db.execute(entregados_stmt)).first()
    monto_total = res_entregados[0] or Decimal("0.00")
    total_pedidos = res_entregados[1] or 0

    ticket_promedio = (monto_total / total_pedidos) if total_pedidos > 0 else Decimal("0.00")

    # Ventas por sector (agrícola vs ganadero)
    sector_stmt = select(
        Categoria.tipo_sector,
        func.coalesce(func.sum(DetallePedido.subtotal), Decimal("0.00"))
    ).join(Producto, DetallePedido.id_producto == Producto.id_producto
    ).join(Categoria, Producto.id_categoria == Categoria.id_categoria
    ).join(Pedido, DetallePedido.id_pedido == Pedido.id_pedido
    ).where(Pedido.id_estado == 5
    ).group_by(Categoria.tipo_sector)

    res_sectores = (await db.execute(sector_stmt)).all()
    ventas_agricolas = Decimal("0.00")
    ventas_ganaderas = Decimal("0.00")
    for sec, sum_val in res_sectores:
        if sec == "agricola":
            ventas_agricolas = sum_val
        elif sec == "ganadero":
            ventas_ganaderas = sum_val

    # Top productores por volumen facturado
    top_stmt = select(
        Productor.nombre_negocio,
        Productor.municipio,
        func.coalesce(func.sum(Pedido.total), Decimal("0.00")).label("ventas"),
        func.count(Pedido.id_pedido).label("pedidos")
    ).join(Pedido, Productor.id_productor == Pedido.id_productor
    ).where(Pedido.id_estado == 5
    ).group_by(Productor.id_productor, Productor.nombre_negocio, Productor.municipio
    ).order_by(desc("ventas")
    ).limit(5)

    res_top = (await db.execute(top_stmt)).all()
    top_productores = [
        {
            "nombre_negocio": row[0],
            "municipio": row[1],
            "ventas_totales": float(row[2]),
            "pedidos_cerrados": row[3]
        }
        for row in res_top
    ]

    return AdminReportSalesResponse(
        monto_total_ventas=monto_total,
        total_pedidos_cerrados=total_pedidos,
        ticket_promedio=ticket_promedio,
        ventas_agricolas=ventas_agricolas,
        ventas_ganaderas=ventas_ganaderas,
        top_productores=top_productores
    )
