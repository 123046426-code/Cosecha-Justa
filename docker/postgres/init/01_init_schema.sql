-- =============================================================================
-- PROYECTO: Cosecha Justa
-- UNIVERSIDAD POLITÉCNICA DE QUERÉTARO (UPQ) - Estadía 2026
-- SCRIPT DE CREACIÓN DE ESQUEMA RELACIONAL Y CATÁLOGOS BASE
-- Base de Datos: PostgreSQL 16
-- Cumple con: 3FN, Integridad Referencial, Restricciones CHECK y Reglas de Negocio
-- =============================================================================

-- 1. TABLA: roles
CREATE TABLE IF NOT EXISTS roles (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(30) UNIQUE NOT NULL
);

-- 2. TABLA: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INT NOT NULL REFERENCES roles(id_rol) ON DELETE RESTRICT,
    nombre VARCHAR(80) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    contrasena_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA: productores
CREATE TABLE IF NOT EXISTS productores (
    id_productor SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    nombre_negocio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    municipio VARCHAR(80) NOT NULL,
    estado VARCHAR(60) NOT NULL,
    estatus_validacion VARCHAR(15) NOT NULL DEFAULT 'pendiente' 
        CHECK (estatus_validacion IN ('pendiente', 'validado', 'rechazado'))
);

-- 4. TABLA: consumidores
CREATE TABLE IF NOT EXISTS consumidores (
    id_consumidor SERIAL PRIMARY KEY,
    id_usuario INT UNIQUE NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    direccion VARCHAR(200),
    municipio VARCHAR(80)
);

-- 5. TABLA: categorias
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(60) UNIQUE NOT NULL,
    tipo_sector VARCHAR(15) NOT NULL 
        CHECK (tipo_sector IN ('agricola', 'ganadero')),
    activa BOOLEAN NOT NULL DEFAULT TRUE
);

-- 6. TABLA: unidades_medida
CREATE TABLE IF NOT EXISTS unidades_medida (
    id_unidad SERIAL PRIMARY KEY,
    nombre VARCHAR(30) UNIQUE NOT NULL,
    abreviatura VARCHAR(10) NOT NULL
);

-- 7. TABLA: productos
CREATE TABLE IF NOT EXISTS productos (
    id_producto SERIAL PRIMARY KEY,
    id_productor INT NOT NULL REFERENCES productores(id_productor) ON DELETE RESTRICT,
    id_categoria INT NOT NULL REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    id_unidad INT NOT NULL REFERENCES unidades_medida(id_unidad) ON DELETE RESTRICT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio NUMERIC(10,2) NOT NULL CHECK (precio > 0),
    cantidad_disponible NUMERIC(10,2) NOT NULL CHECK (cantidad_disponible >= 0),
    foto_url VARCHAR(255),
    estado VARCHAR(12) NOT NULL DEFAULT 'publicado' 
        CHECK (estado IN ('publicado', 'pausado', 'retirado')),
    motivo_retiro VARCHAR(200)
);

-- 8. TABLA: opciones_entrega
CREATE TABLE IF NOT EXISTS opciones_entrega (
    id_opcion SERIAL PRIMARY KEY,
    nombre VARCHAR(40) UNIQUE NOT NULL,
    descripcion VARCHAR(150)
);

-- 9. TABLA: productor_opcion_entrega
CREATE TABLE IF NOT EXISTS productor_opcion_entrega (
    id_productor INT NOT NULL REFERENCES productores(id_productor) ON DELETE CASCADE,
    id_opcion INT NOT NULL REFERENCES opciones_entrega(id_opcion) ON DELETE CASCADE,
    costo_envio NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (costo_envio >= 0),
    PRIMARY KEY (id_productor, id_opcion)
);

-- 10. TABLA: carritos
CREATE TABLE IF NOT EXISTS carritos (
    id_carrito SERIAL PRIMARY KEY,
    id_consumidor INT UNIQUE NOT NULL REFERENCES consumidores(id_consumidor) ON DELETE CASCADE,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. TABLA: carrito_items
CREATE TABLE IF NOT EXISTS carrito_items (
    id_item SERIAL PRIMARY KEY,
    id_carrito INT NOT NULL REFERENCES carritos(id_carrito) ON DELETE CASCADE,
    id_producto INT NOT NULL REFERENCES productos(id_producto) ON DELETE RESTRICT,
    cantidad NUMERIC(10,2) NOT NULL CHECK (cantidad > 0),
    UNIQUE (id_carrito, id_producto)
);

-- 12. TABLA: estados_pedido
CREATE TABLE IF NOT EXISTS estados_pedido (
    id_estado SERIAL PRIMARY KEY,
    nombre VARCHAR(30) UNIQUE NOT NULL,
    orden INT NOT NULL
);

-- 13. TABLA: pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_consumidor INT NOT NULL REFERENCES consumidores(id_consumidor) ON DELETE RESTRICT,
    id_productor INT NOT NULL REFERENCES productores(id_productor) ON DELETE RESTRICT,
    id_opcion INT NOT NULL REFERENCES opciones_entrega(id_opcion) ON DELETE RESTRICT,
    id_estado INT NOT NULL REFERENCES estados_pedido(id_estado) ON DELETE RESTRICT,
    total NUMERIC(10,2) NOT NULL CHECK (total >= 0),
    direccion_entrega VARCHAR(200),
    motivo_rechazo VARCHAR(200),
    fecha_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. TABLA: detalle_pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedidos(id_pedido) ON DELETE RESTRICT,
    id_producto INT NOT NULL REFERENCES productos(id_producto) ON DELETE RESTRICT,
    cantidad NUMERIC(10,2) NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario > 0),
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0)
);

-- 15. TABLA: historial_estado_pedido
CREATE TABLE IF NOT EXISTS historial_estado_pedido (
    id_historial SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedidos(id_pedido) ON DELETE RESTRICT,
    id_estado INT NOT NULL REFERENCES estados_pedido(id_estado) ON DELETE RESTRICT,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    fecha_cambio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 16. TABLA: calificaciones
CREATE TABLE IF NOT EXISTS calificaciones (
    id_calificacion SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL REFERENCES pedidos(id_pedido) ON DELETE CASCADE,
    id_producto INT REFERENCES productos(id_producto) ON DELETE CASCADE,
    id_consumidor INT NOT NULL REFERENCES consumidores(id_consumidor) ON DELETE RESTRICT,
    puntuacion SMALLINT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario VARCHAR(300),
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (id_pedido, id_producto)
);

-- 17. TABLA: incidencias
CREATE TABLE IF NOT EXISTS incidencias (
    id_incidencia SERIAL PRIMARY KEY,
    id_usuario_reporta INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    id_admin_atiende INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    id_pedido INT REFERENCES pedidos(id_pedido) ON DELETE SET NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(12) NOT NULL DEFAULT 'abierta' 
        CHECK (estado IN ('abierta', 'en_revision', 'resuelta')),
    resolucion TEXT,
    fecha_reporte TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- ÍNDICES ESTRATÉGICOS SUGERIDOS EN EL DISEÑO
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_productos_cat_estado ON productos(id_categoria, estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_consumidor ON pedidos(id_consumidor);
CREATE INDEX IF NOT EXISTS idx_pedidos_productor_estado ON pedidos(id_productor, id_estado);
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos(nombre);
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo);

-- =============================================================================
-- DATOS SEMILLA / CATÁLOGOS INICIALES Y USUARIOS DE PRUEBA
-- =============================================================================

-- Roles
INSERT INTO roles (id_rol, nombre) VALUES
    (1, 'administrador'),
    (2, 'productor'),
    (3, 'consumidor')
ON CONFLICT (id_rol) DO NOTHING;

-- Estados de pedido
INSERT INTO estados_pedido (id_estado, nombre, orden) VALUES
    (1, 'pendiente', 1),
    (2, 'aceptado', 2),
    (3, 'en preparación', 3),
    (4, 'listo', 4),
    (5, 'entregado', 5),
    (6, 'rechazado', 6)
ON CONFLICT (id_estado) DO NOTHING;

-- Unidades de medida
INSERT INTO unidades_medida (id_unidad, nombre, abreviatura) VALUES
    (1, 'Kilogramo', 'kg'),
    (2, 'Gramo', 'g'),
    (3, 'Litro', 'l'),
    (4, 'Pieza', 'pza'),
    (5, 'Docena', 'doc'),
    (6, 'Manojo', 'manojo')
ON CONFLICT (id_unidad) DO NOTHING;

-- Categorías (Agrícolas y Ganaderas)
INSERT INTO categorias (id_categoria, nombre, tipo_sector, activa) VALUES
    (1, 'Frutas frescas', 'agricola', TRUE),
    (2, 'Verduras y hortalizas', 'agricola', TRUE),
    (3, 'Legumbres y granos', 'agricola', TRUE),
    (4, 'Hierbas y especias', 'agricola', TRUE),
    (5, 'Lácteos artesanales', 'ganadero', TRUE),
    (6, 'Huevos de libre pastoreo', 'ganadero', TRUE),
    (7, 'Miel y derivados', 'agricola', TRUE),
    (8, 'Carnes y embutidos locales', 'ganadero', TRUE)
ON CONFLICT (id_categoria) DO NOTHING;

-- Opciones de entrega predeterminadas
INSERT INTO opciones_entrega (id_opcion, nombre, descripcion) VALUES
    (1, 'Entrega a domicilio', 'El productor o mensajería local entrega en el domicilio del consumidor'),
    (2, 'Recolección en finca/huerto', 'El consumidor acude a las instalaciones del productor a recoger su pedido'),
    (3, 'Punto medio de encuentro', 'Acuerdo de entrega en una plaza o mercado local')
ON CONFLICT (id_opcion) DO NOTHING;

-- 1. Usuario Administrador (Password: Admin1234*)
INSERT INTO usuarios (id_usuario, id_rol, nombre, apellidos, correo, contrasena_hash, telefono, activo)
VALUES (
    1, 
    1, 
    'Administrador', 
    'Cosecha Justa', 
    'admin@cosechajusta.upq.edu.mx', 
    '$2b$12$2zgaHV9PkAJCEAUsZbK14OLUPF0TJ8Dldu9OEQkOb.Ge.CicHXAGm', 
    '4421019000', 
    TRUE
) ON CONFLICT (correo) DO UPDATE SET contrasena_hash = EXCLUDED.contrasena_hash, activo = TRUE;

-- 2. Usuario Productor (Password: Productor1234*)
INSERT INTO usuarios (id_usuario, id_rol, nombre, apellidos, correo, contrasena_hash, telefono, activo)
VALUES (
    2,
    2,
    'Don Pedro',
    'González Huerta',
    'productor@cosechajusta.upq.edu.mx',
    '$2b$12$QLEoEtXKUTM1iNjvXhw9bOznukLeqFX9oLyKyseo0pb45.PIIj3k.',
    '4425550101',
    TRUE
) ON CONFLICT (correo) DO UPDATE SET contrasena_hash = EXCLUDED.contrasena_hash, activo = TRUE;

INSERT INTO productores (id_productor, id_usuario, nombre_negocio, descripcion, municipio, estado, estatus_validacion)
VALUES (
    1,
    2,
    'Huerto Orgánico El Sembrador',
    'Cultivo sustentable de hortalizas y frutas libres de agroquímicos en El Marqués, Querétaro.',
    'El Marqués',
    'Querétaro',
    'validado'
) ON CONFLICT (id_usuario) DO NOTHING;

-- 3. Usuario Consumidor (Password: Consumidor1234*)
INSERT INTO usuarios (id_usuario, id_rol, nombre, apellidos, correo, contrasena_hash, telefono, activo)
VALUES (
    3,
    3,
    'María',
    'Hernández López',
    'consumidor@cosechajusta.upq.edu.mx',
    '$2b$12$62vx2WeNBogiJrCRqMwHqO9n.yTLuxNUxN8WDgXvf.TVUkSWc9N76',
    '4425550202',
    TRUE
) ON CONFLICT (correo) DO UPDATE SET contrasena_hash = EXCLUDED.contrasena_hash, activo = TRUE;

INSERT INTO consumidores (id_consumidor, id_usuario, direccion, municipio)
VALUES (
    1,
    3,
    'Av. de la Luz 450, Col. Satélite',
    'Querétaro'
) ON CONFLICT (id_usuario) DO NOTHING;

INSERT INTO carritos (id_carrito, id_consumidor)
VALUES (1, 1) ON CONFLICT (id_consumidor) DO NOTHING;

-- Opciones de entrega del productor
INSERT INTO productor_opcion_entrega (id_productor, id_opcion, costo_envio)
VALUES 
    (1, 1, 35.00),
    (1, 2, 0.00)
ON CONFLICT (id_productor, id_opcion) DO NOTHING;

-- Productos semilla para catálogo
INSERT INTO productos (id_producto, id_productor, id_categoria, id_unidad, nombre, descripcion, precio, cantidad_disponible, foto_url, estado)
VALUES
    (1, 1, 2, 1, 'Jitomate Saladette Orgánico', 'Jitomate fresco de invernadero cultivado sin pesticidas sintéticos.', 28.50, 85.00, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500', 'publicado'),
    (2, 1, 1, 1, 'Manzana Criolla San Joaquín', 'Manzana dulce y crujiente cosechada en huerto familiar.', 42.00, 120.00, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500', 'publicado'),
    (3, 1, 2, 6, 'Espinaca Baby Fresca', 'Manojo de espinaca recién cortada, desinfectada y lista para ensaladas.', 18.00, 40.00, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500', 'publicado'),
    (4, 1, 5, 1, 'Queso Ranchero Artesanal', 'Elaborado con leche bronca 100% de vaca, sal de grano y cuajo natural.', 110.00, 25.00, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500', 'publicado'),
    (5, 1, 7, 3, 'Miel Pura de Flor de Azahar', 'Miel pura de abeja cosechada artesanalmente sin calentar ni alterar.', 160.00, 30.00, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', 'publicado')
ON CONFLICT (id_producto) DO NOTHING;

-- Ajustar secuencias de ID
SELECT setval('roles_id_rol_seq', (SELECT MAX(id_rol) FROM roles));
SELECT setval('estados_pedido_id_estado_seq', (SELECT MAX(id_estado) FROM estados_pedido));
SELECT setval('unidades_medida_id_unidad_seq', (SELECT MAX(id_unidad) FROM unidades_medida));
SELECT setval('categorias_id_categoria_seq', (SELECT MAX(id_categoria) FROM categorias));
SELECT setval('opciones_entrega_id_opcion_seq', (SELECT MAX(id_opcion) FROM opciones_entrega));
SELECT setval('usuarios_id_usuario_seq', (SELECT GREATEST(MAX(id_usuario), 3) FROM usuarios));
SELECT setval('productores_id_productor_seq', (SELECT GREATEST(MAX(id_productor), 1) FROM productores));
SELECT setval('consumidores_id_consumidor_seq', (SELECT GREATEST(MAX(id_consumidor), 1) FROM consumidores));
SELECT setval('carritos_id_carrito_seq', (SELECT GREATEST(MAX(id_carrito), 1) FROM carritos));
SELECT setval('productos_id_producto_seq', (SELECT GREATEST(MAX(id_producto), 5) FROM productos));
