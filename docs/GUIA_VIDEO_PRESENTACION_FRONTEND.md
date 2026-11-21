# 🎬 Guía y Guion: Video de Presentación del FrontEnd (Avance 1)
**Proyecto:** Cosecha Justa  
**Universidad Politécnica de Querétaro (UPQ)**  
**Carrera:** Ingeniería en Sistemas Computacionales  
**Duración Estimada:** 5 a 7 minutos  
**Formato de Entrega:** Enlace a video grabado (YouTube no listado / Google Drive)

---

## 👥 Reparto y Distribución del Equipo (4 Integrantes)

| Integrante | Rol en la Presentación | Bloque Temático |
| :--- | :--- | :--- |
| **Integrante 1 (e.g. Dulce María)** | Presentadora & Coordinadora | Introducción al proyecto, justificación de arquitectura desacoplada y resumen del alcance. |
| **Integrante 2 (e.g. Javier Guerson)** | Especialista FrontEnd Móvil (Consumidor) | Demostración en vivo de la App Móvil: Registro, catálogo, filtros, comparador de precios y carrito. |
| **Integrante 3 (e.g. Andrés)** | Especialista FrontEnd Móvil (Productor) | Demostración en vivo de la App Móvil: Publicación de productos, ajuste de precios/stock y gestión de pedidos. |
| **Integrante 4 (e.g. Gabriel Iván)** | Especialista FrontEnd Web (Laravel) & Conclusiones | Demostración del Panel Web de Administración: Aprobación de productores, supervisión y cierre. |

---

## 📋 Estructura y Escaleta del Video

### Minuto 0:00 - 1:00 | Bloque 1: Introducción y Arquitectura Desacoplada
- **Pantalla**: Diapositiva institucional con logotipo de la UPQ, título "Cosecha Justa" y nombres de los integrantes.
- **Voz (Integrante 1)**:
  > *"Buen día asesor y revisores. Presentamos el Avance 1 de nuestro proyecto de estadía Cosecha Justa, una plataforma tecnológica diseñada para vincular directamente a pequeños productores locales con consumidores en Querétaro. Siguiendo los requerimientos de la ficha técnica, implementamos una arquitectura desacoplada obligatoria donde una aplicación móvil en React Native y un panel web en Laravel consumen de manera centralizada una API en FastAPI respaldada por PostgreSQL 16."*

### Minuto 1:00 - 2:30 | Bloque 2: FrontEnd Móvil - Perfil Consumidor
- **Pantalla**: Emulador de React Native mostrando la app móvil.
- **Acciones en pantalla (Integrante 2)**:
  1. Inicio de sesión como consumidor (`consumidor@cosechajusta.upq.edu.mx`).
  2. Búsqueda y filtrado de productos por sector (*Agrícola / Ganadero*).
  3. Demostración del **Comparador de Precios** (`RF-CON-04`), resaltando la transparencia para evitar intermediación abusiva.
  4. Agregar producto al carrito de compras (`RF-CON-05`).
  5. Confirmación de pedido con opción de entrega (`RF-CON-06`).
  6. Consulta de historial de pedidos y trazabilidad (`RF-CON-07`, `RF-CON-08`).

### Minuto 2:30 - 4:00 | Bloque 3: FrontEnd Móvil - Perfil Productor
- **Pantalla**: Emulador de React Native con perfil de Productor.
- **Acciones en pantalla (Integrante 3)**:
  1. Cambio de sesión al perfil Productor (`productor@cosechajusta.upq.edu.mx`).
  2. Vista del **Dashboard de Productor** con métricas de ventas y pedidos pendientes (`RF-PRO-10`).
  3. Alta y edición de producto con precio y existencia (`RF-PRO-03`, `RF-PRO-04`, `RF-PRO-05`).
  4. Demostración de pausar/publicar producto sin eliminarlo (`RF-PRO-06`).
  5. Recepción y avance de estado del pedido (*Pendiente -> Aceptado -> En preparación -> Listo -> Entregado*) (`RF-PRO-08`, `RF-PRO-09`).

### Minuto 4:00 - 5:30 | Bloque 4: FrontEnd Web - Panel de Administración (Laravel)
- **Pantalla**: Navegador web en `http://localhost:8080` mostrando el panel de Laravel.
- **Acciones en pantalla (Integrante 4)**:
  1. Login administrativo (`admin@cosechajusta.upq.edu.mx`).
  2. Vista del dashboard con métricas globales generadas por FastAPI (`RF-ADM-07`).
  3. Módulo de **Validación de Productores**: aprobar o rechazar nuevos agricultores (`RF-ADM-03`).
  4. Módulo de **Gestión de Usuarios**: activación y desactivación de cuentas (`RF-ADM-02`).
  5. Retiro preventivo de productos que violen normativas con motivo justificado (`RF-ADM-05`).

### Minuto 5:30 - 6:00 | Bloque 5: Conclusiones y Cumplimiento
- **Voz (Integrante 1 o 4)**:
  > *"Con esto damos cumplimiento integral a todos los entregables del Avance 1: FrontEnd móvil en React Native listo con ambos perfiles, FrontEnd web de administración en Laravel funcional, repositorio en control de versiones Git desacoplado y este video demostrativo. En el Avance 2 continuaremos con el blindaje de endpoints y pruebas de integración."*

---

## 🛠️ Checklist Técnico antes de Grabar

- [ ] Contenedores Docker levantados (`docker compose up -d`).
- [ ] Base de datos PostgreSQL con datos semilla precargados.
- [ ] API de FastAPI respondiendo en `http://localhost:8000`.
- [ ] App móvil ejecutándose en emulador Android, Expo Go o Web (`npm run start`).
- [ ] Panel Laravel corriendo en `http://localhost:8080`.
- [ ] Resolución de grabación sugerida: 1080p (Full HD) a 30 o 60 fps con OBS Studio.
