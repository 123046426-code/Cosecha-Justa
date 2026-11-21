from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.models import Categoria, UnidadMedida, OpcionEntrega, EstadoPedido
from app.schemas.schemas import (
    CategoriaResponse, UnidadMedidaResponse,
    OpcionEntregaResponse
)

router = APIRouter()

@router.get("/categories", response_model=List[CategoriaResponse])
async def get_categories(db: AsyncSession = Depends(get_db)):
    """Obtiene las categorías activas (agrícolas y ganaderas)"""
    stmt = select(Categoria).where(Categoria.activa == True).order_by(Categoria.nombre)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/units", response_model=List[UnidadMedidaResponse])
async def get_units(db: AsyncSession = Depends(get_db)):
    """Obtiene el catálogo de unidades de medida"""
    stmt = select(UnidadMedida).order_by(UnidadMedida.nombre)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/delivery-options", response_model=List[OpcionEntregaResponse])
async def get_delivery_options(db: AsyncSession = Depends(get_db)):
    """Obtiene el catálogo de opciones de entrega disponibles"""
    stmt = select(OpcionEntrega).order_by(OpcionEntrega.id_opcion)
    result = await db.execute(stmt)
    return result.scalars().all()
