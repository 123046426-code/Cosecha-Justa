from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# ----------------- TOKEN -----------------
class Token(BaseModel):
    access_token: str
    token_type: str
    role_id: int
    user_id: int
    name: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role_id: Optional[int] = None
    exp: Optional[int] = None

# ----------------- USUARIOS -----------------
class UsuarioBase(BaseModel):
    nombre: str = Field(..., max_length=80)
    apellidos: str = Field(..., max_length=100)
    correo: EmailStr
    telefono: Optional[str] = Field(None, max_length=20)

class UsuarioCreate(UsuarioBase):
    contrasena: str = Field(..., min_length=6)
    id_rol: int = Field(..., description="1: Admin, 2: Productor, 3: Consumidor")

class UsuarioLogin(BaseModel):
    correo: EmailStr
    contrasena: str

class UsuarioResponse(UsuarioBase):
    id_usuario: int
    id_rol: int
    activo: bool
    fecha_registro: datetime

    class Config:
        from_attributes = True

# ----------------- PRODUCTOR -----------------
class ProductorBase(BaseModel):
    nombre_negocio: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    municipio: str = Field(..., max_length=80)
    estado: str = Field(..., max_length=60)

class ProductorCreate(ProductorBase):
    id_usuario: int

class ProductorResponse(ProductorBase):
    id_productor: int
    id_usuario: int
    estatus_validacion: str

    class Config:
        from_attributes = True

# ----------------- CONSUMIDOR -----------------
class ConsumidorBase(BaseModel):
    direccion: Optional[str] = Field(None, max_length=200)
    municipio: Optional[str] = Field(None, max_length=80)

class ConsumidorCreate(ConsumidorBase):
    id_usuario: int

class ConsumidorResponse(ConsumidorBase):
    id_consumidor: int
    id_usuario: int

    class Config:
        from_attributes = True

# ----------------- CATEGORÍAS -----------------
class CategoriaResponse(BaseModel):
    id_categoria: int
    nombre: str
    tipo_sector: str
    activa: bool

    class Config:
        from_attributes = True

class CategoriaCreate(BaseModel):
    nombre: str = Field(..., max_length=60)
    tipo_sector: str = Field(..., pattern="^(agricola|ganadero)$")
    activa: bool = True

# ----------------- UNIDADES DE MEDIDA -----------------
class UnidadMedidaResponse(BaseModel):
    id_unidad: int
    nombre: str
    abreviatura: str

    class Config:
        from_attributes = True

# ----------------- PRODUCTOS -----------------
class ProductoBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    descripcion: Optional[str] = None
    precio: Decimal = Field(..., gt=0, decimal_places=2)
    cantidad_disponible: Decimal = Field(..., ge=0, decimal_places=2)
    foto_url: Optional[str] = None
    id_categoria: int
    id_unidad: int

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[Decimal] = Field(None, gt=0)
    cantidad_disponible: Optional[Decimal] = Field(None, ge=0)
    foto_url: Optional[str] = None
    estado: Optional[str] = Field(None, pattern="^(publicado|pausado|retirado)$")
    motivo_retiro: Optional[str] = None

class ProductoResponse(ProductoBase):
    id_producto: int
    id_productor: int
    estado: str
    motivo_retiro: Optional[str] = None
    nombre_categoria: Optional[str] = None
    abreviatura_unidad: Optional[str] = None
    nombre_productor: Optional[str] = None

    class Config:
        from_attributes = True

# ----------------- OPCIONES DE ENTREGA -----------------
class OpcionEntregaResponse(BaseModel):
    id_opcion: int
    nombre: str
    descripcion: Optional[str] = None

    class Config:
        from_attributes = True

class ProductorOpcionEntregaItem(BaseModel):
    id_opcion: int
    costo_envio: Decimal = Field(default=Decimal("0.00"), ge=0)

# ----------------- CARRITO -----------------
class CarritoItemCreate(BaseModel):
    id_producto: int
    cantidad: Decimal = Field(..., gt=0)

class CarritoItemResponse(BaseModel):
    id_item: int
    id_producto: int
    nombre_producto: str
    precio_unitario: Decimal
    cantidad: Decimal
    subtotal: Decimal

class CarritoResponse(BaseModel):
    id_carrito: int
    items: List[CarritoItemResponse]
    total_estimado: Decimal

# ----------------- PEDIDOS -----------------
class DetallePedidoCreate(BaseModel):
    id_producto: int
    cantidad: Decimal = Field(..., gt=0)

class PedidoCreate(BaseModel):
    id_productor: int
    id_opcion: int
    direccion_entrega: Optional[str] = None
    items: List[DetallePedidoCreate]

class DetallePedidoResponse(BaseModel):
    id_detalle: int
    id_producto: int
    nombre_producto: str
    cantidad: Decimal
    precio_unitario: Decimal
    subtotal: Decimal

    class Config:
        from_attributes = True

class PedidoResponse(BaseModel):
    id_pedido: int
    id_consumidor: int
    id_productor: int
    nombre_negocio_productor: Optional[str] = None
    id_opcion: int
    id_estado: int
    nombre_estado: Optional[str] = None
    total: Decimal
    direccion_entrega: Optional[str] = None
    motivo_rechazo: Optional[str] = None
    fecha_pedido: datetime
    detalles: List[DetallePedidoResponse] = []

    class Config:
        from_attributes = True

class CambioEstadoPedido(BaseModel):
    id_estado: int
    motivo_rechazo: Optional[str] = None

# ----------------- CALIFICACIONES -----------------
class CalificacionCreate(BaseModel):
    id_pedido: int
    id_producto: Optional[int] = None
    puntuacion: int = Field(..., ge=1, le=5)
    comentario: Optional[str] = Field(None, max_length=300)

class CalificacionResponse(BaseModel):
    id_calificacion: int
    id_pedido: int
    id_producto: Optional[int] = None
    id_consumidor: int
    puntuacion: int
    comentario: Optional[str] = None
    fecha: datetime

    class Config:
        from_attributes = True

# ----------------- INCIDENCIAS -----------------
class IncidenciaCreate(BaseModel):
    id_pedido: Optional[int] = None
    descripcion: str

class IncidenciaUpdate(BaseModel):
    estado: str = Field(..., pattern="^(abierta|en_revision|resuelta)$")
    resolucion: Optional[str] = None

class IncidenciaResponse(BaseModel):
    id_incidencia: int
    id_usuario_reporta: int
    id_admin_atiende: Optional[int] = None
    id_pedido: Optional[int] = None
    descripcion: str
    estado: str
    resolucion: Optional[str] = None
    fecha_reporte: datetime

    class Config:
        from_attributes = True

# ----------------- ESTADÍSTICAS -----------------
class EstadisticasProductorResponse(BaseModel):
    total_ventas_monto: Decimal
    total_pedidos: int
    pedidos_pendientes: int
    pedidos_completados: int
    productos_mas_vendidos: List[dict]

class EstadisticasAdminResponse(BaseModel):
    total_usuarios: int
    total_productores: int
    total_consumidores: int
    total_productos_activos: int
    total_pedidos_global: int
    monto_total_transacciones: Decimal
    incidencias_abiertas: int
