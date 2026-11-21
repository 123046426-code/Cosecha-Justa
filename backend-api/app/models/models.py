from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Numeric,
    SmallInteger, Text, ForeignKey, UniqueConstraint, CheckConstraint
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class Rol(Base):
    __tablename__ = "roles"

    id_rol = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30), unique=True, nullable=False)

    usuarios = relationship("Usuario", back_populates="rol")


class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    id_rol = Column(Integer, ForeignKey("roles.id_rol", ondelete="RESTRICT"), nullable=False)
    nombre = Column(String(80), nullable=False)
    apellidos = Column(String(100), nullable=False)
    correo = Column(String(120), unique=True, index=True, nullable=False)
    contrasena_hash = Column(String(255), nullable=False)
    telefono = Column(String(20), nullable=True)
    activo = Column(Boolean, default=True, nullable=False)
    fecha_registro = Column(DateTime, default=datetime.utcnow, nullable=False)

    rol = relationship("Rol", back_populates="usuarios")
    productor = relationship("Productor", back_populates="usuario", uselist=False, cascade="all, delete")
    consumidor = relationship("Consumidor", back_populates="usuario", uselist=False, cascade="all, delete")
    historial_estados = relationship("HistorialEstadoPedido", back_populates="usuario")
    incidencias_reportadas = relationship("Incidencia", foreign_keys="Incidencia.id_usuario_reporta", back_populates="usuario_reporta")
    incidencias_atendidas = relationship("Incidencia", foreign_keys="Incidencia.id_admin_atiende", back_populates="admin_atiende")


class Productor(Base):
    __tablename__ = "productores"

    id_productor = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), unique=True, nullable=False)
    nombre_negocio = Column(String(100), nullable=False)
    descripcion = Column(Text, nullable=True)
    municipio = Column(String(80), nullable=False)
    estado = Column(String(60), nullable=False)
    estatus_validacion = Column(String(15), default="pendiente", nullable=False)

    __table_args__ = (
        CheckConstraint("estatus_validacion IN ('pendiente', 'validado', 'rechazado')", name="chk_productor_estatus"),
    )

    usuario = relationship("Usuario", back_populates="productor")
    productos = relationship("Producto", back_populates="productor")
    pedidos = relationship("Pedido", back_populates="productor")
    opciones_entrega = relationship("ProductorOpcionEntrega", back_populates="productor", cascade="all, delete")


class Consumidor(Base):
    __tablename__ = "consumidores"

    id_consumidor = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="CASCADE"), unique=True, nullable=False)
    direccion = Column(String(200), nullable=True)
    municipio = Column(String(80), nullable=True)

    usuario = relationship("Usuario", back_populates="consumidor")
    carrito = relationship("Carrito", back_populates="consumidor", uselist=False, cascade="all, delete")
    pedidos = relationship("Pedido", back_populates="consumidor")
    calificaciones = relationship("Calificacion", back_populates="consumidor")


class Categoria(Base):
    __tablename__ = "categorias"

    id_categoria = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(60), unique=True, nullable=False)
    tipo_sector = Column(String(15), nullable=False)
    activa = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        CheckConstraint("tipo_sector IN ('agricola', 'ganadero')", name="chk_categoria_sector"),
    )

    productos = relationship("Producto", back_populates="categoria")


class UnidadMedida(Base):
    __tablename__ = "unidades_medida"

    id_unidad = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30), unique=True, nullable=False)
    abreviatura = Column(String(10), nullable=False)

    productos = relationship("Producto", back_populates="unidad_medida")


class Producto(Base):
    __tablename__ = "productos"

    id_producto = Column(Integer, primary_key=True, index=True)
    id_productor = Column(Integer, ForeignKey("productores.id_productor", ondelete="RESTRICT"), nullable=False)
    id_categoria = Column(Integer, ForeignKey("categorias.id_categoria", ondelete="RESTRICT"), nullable=False)
    id_unidad = Column(Integer, ForeignKey("unidades_medida.id_unidad", ondelete="RESTRICT"), nullable=False)
    nombre = Column(String(100), nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    precio = Column(Numeric(10, 2), nullable=False)
    cantidad_disponible = Column(Numeric(10, 2), nullable=False)
    foto_url = Column(String(255), nullable=True)
    estado = Column(String(12), default="publicado", nullable=False)
    motivo_retiro = Column(String(200), nullable=True)

    __table_args__ = (
        CheckConstraint("precio > 0", name="chk_producto_precio"),
        CheckConstraint("cantidad_disponible >= 0", name="chk_producto_cantidad"),
        CheckConstraint("estado IN ('publicado', 'pausado', 'retirado')", name="chk_producto_estado"),
    )

    productor = relationship("Productor", back_populates="productos")
    categoria = relationship("Categoria", back_populates="productos")
    unidad_medida = relationship("UnidadMedida", back_populates="productos")
    carrito_items = relationship("CarritoItem", back_populates="producto")
    detalles_pedido = relationship("DetallePedido", back_populates="producto")
    calificaciones = relationship("Calificacion", back_populates="producto")


class OpcionEntrega(Base):
    __tablename__ = "opciones_entrega"

    id_opcion = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(40), unique=True, nullable=False)
    descripcion = Column(String(150), nullable=True)

    productores = relationship("ProductorOpcionEntrega", back_populates="opcion")
    pedidos = relationship("Pedido", back_populates="opcion")


class ProductorOpcionEntrega(Base):
    __tablename__ = "productor_opcion_entrega"

    id_productor = Column(Integer, ForeignKey("productores.id_productor", ondelete="CASCADE"), primary_key=True)
    id_opcion = Column(Integer, ForeignKey("opciones_entrega.id_opcion", ondelete="CASCADE"), primary_key=True)
    costo_envio = Column(Numeric(10, 2), default=Decimal("0.00"), nullable=False)

    __table_args__ = (
        CheckConstraint("costo_envio >= 0", name="chk_envio_costo"),
    )

    productor = relationship("Productor", back_populates="opciones_entrega")
    opcion = relationship("OpcionEntrega", back_populates="productores")


class Carrito(Base):
    __tablename__ = "carritos"

    id_carrito = Column(Integer, primary_key=True, index=True)
    id_consumidor = Column(Integer, ForeignKey("consumidores.id_consumidor", ondelete="CASCADE"), unique=True, nullable=False)
    fecha_actualizacion = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    consumidor = relationship("Consumidor", back_populates="carrito")
    items = relationship("CarritoItem", back_populates="carrito", cascade="all, delete-orphan")


class CarritoItem(Base):
    __tablename__ = "carrito_items"

    id_item = Column(Integer, primary_key=True, index=True)
    id_carrito = Column(Integer, ForeignKey("carritos.id_carrito", ondelete="CASCADE"), nullable=False)
    id_producto = Column(Integer, ForeignKey("productos.id_producto", ondelete="RESTRICT"), nullable=False)
    cantidad = Column(Numeric(10, 2), nullable=False)

    __table_args__ = (
        CheckConstraint("cantidad > 0", name="chk_carrito_item_cantidad"),
        UniqueConstraint("id_carrito", "id_producto", name="uq_carrito_producto"),
    )

    carrito = relationship("Carrito", back_populates="items")
    producto = relationship("Producto", back_populates="carrito_items")


class EstadoPedido(Base):
    __tablename__ = "estados_pedido"

    id_estado = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(30), unique=True, nullable=False)
    orden = Column(Integer, nullable=False)

    pedidos = relationship("Pedido", back_populates="estado")
    historial = relationship("HistorialEstadoPedido", back_populates="estado")


class Pedido(Base):
    __tablename__ = "pedidos"

    id_pedido = Column(Integer, primary_key=True, index=True)
    id_consumidor = Column(Integer, ForeignKey("consumidores.id_consumidor", ondelete="RESTRICT"), nullable=False)
    id_productor = Column(Integer, ForeignKey("productores.id_productor", ondelete="RESTRICT"), nullable=False)
    id_opcion = Column(Integer, ForeignKey("opciones_entrega.id_opcion", ondelete="RESTRICT"), nullable=False)
    id_estado = Column(Integer, ForeignKey("estados_pedido.id_estado", ondelete="RESTRICT"), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)
    direccion_entrega = Column(String(200), nullable=True)
    motivo_rechazo = Column(String(200), nullable=True)
    fecha_pedido = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint("total >= 0", name="chk_pedido_total"),
    )

    consumidor = relationship("Consumidor", back_populates="pedidos")
    productor = relationship("Productor", back_populates="pedidos")
    opcion = relationship("OpcionEntrega", back_populates="pedidos")
    estado = relationship("EstadoPedido", back_populates="pedidos")
    detalles = relationship("DetallePedido", back_populates="pedido", cascade="all, delete-orphan")
    historial = relationship("HistorialEstadoPedido", back_populates="pedido", cascade="all, delete-orphan")
    calificaciones = relationship("Calificacion", back_populates="pedido")
    incidencias = relationship("Incidencia", back_populates="pedido")


class DetallePedido(Base):
    __tablename__ = "detalle_pedido"

    id_detalle = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido", ondelete="RESTRICT"), nullable=False)
    id_producto = Column(Integer, ForeignKey("productos.id_producto", ondelete="RESTRICT"), nullable=False)
    cantidad = Column(Numeric(10, 2), nullable=False)
    precio_unitario = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)

    __table_args__ = (
        CheckConstraint("cantidad > 0", name="chk_detalle_cantidad"),
        CheckConstraint("precio_unitario > 0", name="chk_detalle_precio"),
        CheckConstraint("subtotal >= 0", name="chk_detalle_subtotal"),
    )

    pedido = relationship("Pedido", back_populates="detalles")
    producto = relationship("Producto", back_populates="detalles_pedido")


class HistorialEstadoPedido(Base):
    __tablename__ = "historial_estado_pedido"

    id_historial = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido", ondelete="RESTRICT"), nullable=False)
    id_estado = Column(Integer, ForeignKey("estados_pedido.id_estado", ondelete="RESTRICT"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT"), nullable=False)
    fecha_cambio = Column(DateTime, default=datetime.utcnow, nullable=False)

    pedido = relationship("Pedido", back_populates="historial")
    estado = relationship("EstadoPedido", back_populates="historial")
    usuario = relationship("Usuario", back_populates="historial_estados")


class Calificacion(Base):
    __tablename__ = "calificaciones"

    id_calificacion = Column(Integer, primary_key=True, index=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido", ondelete="CASCADE"), nullable=False)
    id_producto = Column(Integer, ForeignKey("productos.id_producto", ondelete="CASCADE"), nullable=True)
    id_consumidor = Column(Integer, ForeignKey("consumidores.id_consumidor", ondelete="RESTRICT"), nullable=False)
    puntuacion = Column(SmallInteger, nullable=False)
    comentario = Column(String(300), nullable=True)
    fecha = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint("puntuacion >= 1 AND puntuacion <= 5", name="chk_calificacion_puntuacion"),
        UniqueConstraint("id_pedido", "id_producto", name="uq_pedido_producto_calif"),
    )

    pedido = relationship("Pedido", back_populates="calificaciones")
    producto = relationship("Producto", back_populates="calificaciones")
    consumidor = relationship("Consumidor", back_populates="calificaciones")


class Incidencia(Base):
    __tablename__ = "incidencias"

    id_incidencia = Column(Integer, primary_key=True, index=True)
    id_usuario_reporta = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="RESTRICT"), nullable=False)
    id_admin_atiende = Column(Integer, ForeignKey("usuarios.id_usuario", ondelete="SET NULL"), nullable=True)
    id_pedido = Column(Integer, ForeignKey("pedidos.id_pedido", ondelete="SET NULL"), nullable=True)
    descripcion = Column(Text, nullable=False)
    estado = Column(String(12), default="abierta", nullable=False)
    resolucion = Column(Text, nullable=True)
    fecha_reporte = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        CheckConstraint("estado IN ('abierta', 'en_revision', 'resuelta')", name="chk_incidencia_estado"),
    )

    usuario_reporta = relationship("Usuario", foreign_keys=[id_usuario_reporta], back_populates="incidencias_reportadas")
    admin_atiende = relationship("Usuario", foreign_keys=[id_admin_atiende], back_populates="incidencias_atendidas")
    pedido = relationship("Pedido", back_populates="incidencias")
