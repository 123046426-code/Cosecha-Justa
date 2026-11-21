-- Actualización de contraseñas con bcrypt válido y datos semilla de prueba

-- 1. Actualizar usuario administrador
UPDATE usuarios 
SET contrasena_hash = '$2b$12$2zgaHV9PkAJCEAUsZbK14OLUPF0TJ8Dldu9OEQkOb.Ge.CicHXAGm',
    activo = TRUE
WHERE correo = 'admin@cosechajusta.upq.edu.mx';

-- 2. Asegurar usuario Productor de prueba
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
) ON CONFLICT (correo) DO UPDATE 
SET contrasena_hash = EXCLUDED.contrasena_hash, activo = TRUE;

INSERT INTO productores (id_productor, id_usuario, nombre_negocio, descripcion, municipio, estado, estatus_validacion)
VALUES (
    1,
    2,
    'Huerto Orgánico El Sembrador',
    'Cultivo sustentable de hortalizas y frutas libres de agroquímicos en El Marqués, Querétaro.',
    'El Marqués',
    'Querétaro',
    'validado'
) ON CONFLICT (id_usuario) DO UPDATE
SET estatus_validacion = 'validado', nombre_negocio = EXCLUDED.nombre_negocio;

-- 3. Asegurar usuario Consumidor de prueba
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
) ON CONFLICT (correo) DO UPDATE
SET contrasena_hash = EXCLUDED.contrasena_hash, activo = TRUE;

INSERT INTO consumidores (id_consumidor, id_usuario, direccion, municipio)
VALUES (
    1,
    3,
    'Av. de la Luz 450, Col. Satélite',
    'Querétaro'
) ON CONFLICT (id_usuario) DO NOTHING;

INSERT INTO carritos (id_carrito, id_consumidor)
VALUES (1, 1) ON CONFLICT (id_consumidor) DO NOTHING;

-- 4. Opciones de entrega para el productor
INSERT INTO productor_opcion_entrega (id_productor, id_opcion, costo_envio)
VALUES 
    (1, 1, 35.00), -- Entrega a domicilio
    (1, 2, 0.00)   -- Recolección en finca
ON CONFLICT (id_productor, id_opcion) DO NOTHING;

-- 5. Productos iniciales para prueba del catálogo
INSERT INTO productos (id_producto, id_productor, id_categoria, id_unidad, nombre, descripcion, precio, cantidad_disponible, foto_url, estado)
VALUES
    (1, 1, 2, 1, 'Jitomate Saladette Orgánico', 'Jitomate fresco de invernadero cultivado sin pesticidas sintéticos.', 28.50, 85.00, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500', 'publicado'),
    (2, 1, 1, 1, 'Manzana Criolla San Joaquín', 'Manzana dulce y crujiente cosechada en huerto familiar.', 42.00, 120.00, 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500', 'publicado'),
    (3, 1, 2, 6, 'Espinaca Baby Fresca', 'Manojo de espinaca recién cortada, desinfectada y lista para ensaladas.', 18.00, 40.00, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500', 'publicado'),
    (4, 1, 5, 1, 'Queso Ranchero Artesanal', 'Elaborado con leche bronca 100% de vaca, sal de grano y cuajo natural.', 110.00, 25.00, 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500', 'publicado'),
    (5, 1, 7, 3, 'Miel Pura de Flor de Azahar', 'Miel pura de abeja cosechada artesanalmente sin calentar ni alterar.', 160.00, 30.00, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', 'publicado')
ON CONFLICT (id_producto) DO NOTHING;

-- Ajustar secuencias
SELECT setval('usuarios_id_usuario_seq', (SELECT GREATEST(MAX(id_usuario), 3) FROM usuarios));
SELECT setval('productores_id_productor_seq', (SELECT GREATEST(MAX(id_productor), 1) FROM productores));
SELECT setval('consumidores_id_consumidor_seq', (SELECT GREATEST(MAX(id_consumidor), 1) FROM consumidores));
SELECT setval('carritos_id_carrito_seq', (SELECT GREATEST(MAX(id_carrito), 1) FROM carritos));
SELECT setval('productos_id_producto_seq', (SELECT GREATEST(MAX(id_producto), 5) FROM productos));
