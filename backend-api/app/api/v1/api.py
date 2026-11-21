from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth, catalogs, products, producers, orders, admin
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Autenticación y Cuentas"])
api_router.include_router(catalogs.router, prefix="/catalogs", tags=["Catálogos del Sistema"])
api_router.include_router(products.router, prefix="/products", tags=["Productos"])
api_router.include_router(producers.router, prefix="/producers", tags=["Productores"])
api_router.include_router(orders.router, prefix="/orders", tags=["Pedidos y Transacciones"])
api_router.include_router(admin.router, prefix="/admin", tags=["Administración de Plataforma"])
