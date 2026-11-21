from decimal import Decimal
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import selectinload

from app.core.database import get_db
from app.core.security import get_current_user_payload, check_role
from app.models.models import Producto, Productor, Categoria, UnidadMedida
from app.schemas.schemas import (
    ProductoCreate, ProductoUpdate, ProductoResponse
)

router = APIRouter()

@router.get("", response_model=List[ProductoResponse])
async def list_products(
    search: Optional[str] = Query(None, description="Búsqueda por nombre o descripción"),
    category_id: Optional[int] = Query(None, description="Filtrar por categoría"),
    sector: Optional[str] = Query(None, description="agricola o ganadero"),
    producer_id: Optional[int] = Query(None, description="Filtrar por productor"),
    max_price: Optional[Decimal] = Query(None, description="Precio máximo"),
    min_price: Optional[Decimal] = Query(None, description="Precio mínimo"),
    db: AsyncSession = Depends(get_db)
):
    """RF-CON-02 / RF-CON-04: Buscar y filtrar productos en el catálogo público"""
    query = select(Producto).join(Producto.categoria).join(Producto.productor).options(
        selectinload(Producto.categoria),
        selectinload(Producto.unidad_medida),
        selectinload(Producto.productor)
    ).where(Producto.estado == "publicado")

    # Solo mostrar productos de productores validados
    query = query.where(Productor.estatus_validacion == "validado")

    if search:
        query = query.where(or_(
            Producto.nombre.ilike(f"%{search}%"),
            Producto.descripcion.ilike(f"%{search}%")
        ))
    if category_id:
        query = query.where(Producto.id_categoria == category_id)
    if sector:
        query = query.where(Categoria.tipo_sector == sector)
    if producer_id:
        query = query.where(Producto.id_productor == producer_id)
    if min_price is not None:
        query = query.where(Producto.precio >= min_price)
    if max_price is not None:
        query = query.where(Producto.precio <= max_price)

    result = await db.execute(query.order_by(Producto.nombre))
    products = result.scalars().all()

    # Mapear datos enriquecidos para la respuesta
    res = []
    for p in products:
        item = ProductoResponse.from_orm(p)
        item.nombre_categoria = p.categoria.nombre if p.categoria else None
        item.abreviatura_unidad = p.unidad_medida.abreviatura if p.unidad_medida else None
        item.nombre_productor = p.productor.nombre_negocio if p.productor else None
        res.append(item)
    return res

@router.get("/{id_producto}", response_model=ProductoResponse)
async def get_product(id_producto: int, db: AsyncSession = Depends(get_db)):
    """Consulta el detalle de un producto específico"""
    stmt = select(Producto).options(
        selectinload(Producto.categoria),
        selectinload(Producto.unidad_medida),
        selectinload(Producto.productor)
    ).where(Producto.id_producto == id_producto)
    result = await db.execute(stmt)
    p = result.scalars().first()
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    
    item = ProductoResponse.from_orm(p)
    item.nombre_categoria = p.categoria.nombre if p.categoria else None
    item.abreviatura_unidad = p.unidad_medida.abreviatura if p.unidad_medida else None
    item.nombre_productor = p.productor.nombre_negocio if p.productor else None
    return item

@router.post("", response_model=ProductoResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    prod_in: ProductoCreate,
    payload: dict = Depends(check_role(required_role_id=2)),
    db: AsyncSession = Depends(get_db)
):
    """RF-PRO-03: Dar de alta un nuevo producto (Perfil Productor)"""
    user_id = int(payload.get("sub"))
    stmt = select(Productor).where(Productor.id_usuario == user_id)
    res = await db.execute(stmt)
    productor = res.scalars().first()
    if not productor:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se encontró perfil de productor.")

    nuevo_producto = Producto(
        id_productor=productor.id_productor,
        id_categoria=prod_in.id_categoria,
        id_unidad=prod_in.id_unidad,
        nombre=prod_in.nombre,
        descripcion=prod_in.descripcion,
        precio=prod_in.precio,
        cantidad_disponible=prod_in.cantidad_disponible,
        foto_url=prod_in.foto_url,
        estado="publicado"
    )
    db.add(nuevo_producto)
    await db.commit()
    await db.refresh(nuevo_producto)
    return nuevo_producto

@router.put("/{id_producto}", response_model=ProductoResponse)
async def update_product(
    id_producto: int,
    prod_in: ProductoUpdate,
    payload: dict = Depends(check_role(required_role_id=2)),
    db: AsyncSession = Depends(get_db)
):
    """RF-PRO-04 / RF-PRO-05: Modificar precios y cantidades (Perfil Productor)"""
    user_id = int(payload.get("sub"))
    stmt = select(Producto).join(Producto.productor).where(
        and_(Producto.id_producto == id_producto, Productor.id_usuario == user_id)
    )
    res = await db.execute(stmt)
    prod = res.scalars().first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado o sin permisos")

    if prod_in.nombre is not None:
        prod.nombre = prod_in.nombre
    if prod_in.descripcion is not None:
        prod.descripcion = prod_in.descripcion
    if prod_in.precio is not None:
        prod.precio = prod_in.precio
    if prod_in.cantidad_disponible is not None:
        prod.cantidad_disponible = prod_in.cantidad_disponible
    if prod_in.foto_url is not None:
        prod.foto_url = prod_in.foto_url
    if prod_in.estado is not None:
        prod.estado = prod_in.estado

    await db.commit()
    await db.refresh(prod)
    return prod

@router.patch("/{id_producto}/status")
async def toggle_product_status(
    id_producto: int,
    nuevo_estado: str = Query(..., regex="^(publicado|pausado)$"),
    payload: dict = Depends(check_role(required_role_id=2)),
    db: AsyncSession = Depends(get_db)
):
    """RF-PRO-06: Publicar o pausar productos sin eliminarlos"""
    user_id = int(payload.get("sub"))
    stmt = select(Producto).join(Producto.productor).where(
        and_(Producto.id_producto == id_producto, Productor.id_usuario == user_id)
    )
    res = await db.execute(stmt)
    prod = res.scalars().first()
    if not prod:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")

    prod.estado = nuevo_estado
    await db.commit()
    return {"message": f"Producto actualizado al estado: {nuevo_estado}", "id_producto": id_producto}
