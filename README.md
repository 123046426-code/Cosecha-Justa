# Cosecha Justa

Plataforma tecnológica orientada al comercio justo y venta directa entre pequeños productores agrícolas/ganaderos y consumidores finales. Diseñada bajo una **arquitectura desacoplada** de alta cohesión y bajo acoplamiento para la Universidad Politécnica de Querétaro (UPQ).

---

## 🏛️ Topología de la Arquitectura

```
                        ┌────────────────────────────────────────┐
                        │       FRONTEND MOBILE (React Native)   │
                        │    • Perfil Productor (Gestión/Ventas) │
                        │    • Perfil Consumidor (Catálogo/Order)│
                        └───────────────────┬────────────────────┘
                                            │
                                            │ HTTPS / JSON (JWT)
                                            ▼
┌────────────────────────────────┐      ┌────────────────────────┐
│   FRONTEND ADMIN (Laravel)     │      │   BACKEND RESTful API  │
│ • Validación de productores    ├─────►│        (FastAPI)       │
│ • Supervisión y reportes       │      │  • Reglas de negocio   │
│ • Gestión de incidencias       │      │  • Autenticación JWT   │
└────────────────────────────────┘      └───────────┬────────────┘
                                                    │
                                                    │ SQLAlchemy Async / asyncpg
                                                    ▼
                                        ┌────────────────────────┐
                                        │  PostgreSQL 16 Engine  │
                                        │  • 17 Tablas en 3FN    │
                                        │  • Restricciones CHECK │
                                        └────────────────────────┘
```

**Regla de Arquitectura**: Los frontends (móvil y web) nunca acceden directamente a la base de datos PostgreSQL. Toda transacción pasa forzosamente por la API centralizada en FastAPI.

---

## 🧰 Stack Tecnológico

| Capa | Tecnología | Versión / Detalle |
| :--- | :--- | :--- |
| **API Backend** | Python / FastAPI | FastAPI 0.111+, Pydantic v2, Uvicorn, Python-Jose (JWT), bcrypt nativo |
| **Base de Datos** | PostgreSQL | 16-alpine con 17 tablas normalizadas e integridad referencial |
| **Frontend Móvil** | React Native / Expo | Expo SDK 51, React Navigation (Stacks & Tabs), Axios, AsyncStorage |
| **Frontend Web Admin** | PHP / Laravel | Laravel 11, GuzzleHttp / Client Service desacoplado, Bootstrap 5 |
| **Contenerización** | Docker & Compose | Orquestación completa de BD, API y pgAdmin |

---

## 🚀 Inicio Rápido con Docker

La forma recomendada de ejecutar el entorno local completo es mediante Docker Compose:

### 1. Clonar el repositorio y levantar los contenedores
```bash
git clone https://github.com/TU_ORGANIZACION/cosecha-justa.git
cd cosecha-justa
docker compose up -d --build
```

### 2. Servicios disponibles
| Servicio | URL Local | Descripción |
| :--- | :--- | :--- |
| **API RESTful (FastAPI)** | [http://localhost:8000](http://localhost:8000) | Endpoint base de la API |
| **Documentación Swagger UI** | [http://localhost:8000/docs](http://localhost:8000/docs) | Explorador interactivo OpenAPI con soporte OAuth2 |
| **Documentación ReDoc** | [http://localhost:8000/redoc](http://localhost:8000/redoc) | Especificación OpenAPI estructurada |
| **pgAdmin 4** | [http://localhost:5050](http://localhost:5050) | Gestor web visual de PostgreSQL |
| **PostgreSQL 16** | `localhost:5432` | Motor de base de datos relacional |

---

## 🔐 Credenciales del Entorno de Desarrollo

La base de datos se inicializa automáticamente con 3 usuarios predeterminados que cubren cada perfil del sistema:

| Rol | Correo Electrónico | Contraseña | Rol ID | Alcance / Permisos |
| :--- | :--- | :--- | :---: | :--- |
| **Administrador** | `admin@cosechajusta.upq.edu.mx` | `Admin1234*` | `1` | Acceso total al panel Laravel y endpoints `/admin/*` |
| **Productor** | `productor@cosechajusta.upq.edu.mx` | `Productor1234*` | `2` | Gestión de cosechas, precios, inventario y órdenes en la App |
| **Consumidor** | `consumidor@cosechajusta.upq.edu.mx` | `Consumidor1234*` | `3` | Búsqueda, comparación de precios, pedidos y reseñas |

### Credenciales para pgAdmin (`localhost:5050`)
- **Email**: `admin@cosechajusta.upq.edu.mx`
- **Password**: `admin_password_2026`
- **Host de Conexión a BD**: `postgres_db` (o `localhost` si se conecta externamente)
- **Database**: `cosecha_justa_db`
- **User**: `cosecha_user`
- **Password**: `cosecha_secure_password_2026`

---

## 💻 Ejecución de Frontends

### 📱 Frontend Móvil (React Native / Expo)
```bash
cd frontend-mobile
npm install
npm start
```
- Presiona `a` para abrir en el emulador de Android.
- Presiona `w` para abrir en el navegador web.
- O escanea el código QR con la app **Expo Go** en tu smartphone (asegurando estar en la misma red Wi-Fi y configurando la IP LAN en `src/services/api.ts`).

### 🌐 Frontend Web de Administración (Laravel)
```bash
cd frontend-admin
cp .env.example .env
composer install
php artisan key:generate
php artisan serve --port=8080
```
Acceder en [http://localhost:8080](http://localhost:8080).

---

## 🧪 Pruebas de la API (cURL / HTTP)

### 1. Iniciar sesión y obtener JWT
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo": "admin@cosechajusta.upq.edu.mx", "contrasena": "Admin1234*"}'
```

### 2. Consultar catálogo de productos (Público)
```bash
curl -X GET "http://localhost:8000/api/v1/products?sector=agricola"
```

### 3. Endpoint protegido (requiere Bearer Token)
```bash
curl -X GET http://localhost:8000/api/v1/admin/dashboard \
  -H "Authorization: Bearer <TU_TOKEN_JWT>"
```

---

## 📂 Estructura del Proyecto

```
cosecha-justa/
├── docker-compose.yml              # Orquestación de contenedores (Postgres + FastAPI + pgAdmin)
├── .gitignore                      # Reglas de exclusión para Git
├── README.md                       # Documentación técnica general
├── docker/
│   └── postgres/init/
│       ├── 01_init_schema.sql      # Esquema DDL de las 17 tablas + CHECKs + Índices
│       └── 02_seed_data.sql        # Datos semilla para pruebas inmediatas
├── backend-api/                    # Servicio REST FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py                 # Instancia de FastAPI con CORS y prefijos
│       ├── core/                   # config.py, database.py (asyncpg) y security.py (JWT/bcrypt)
│       ├── models/                 # Modelos SQLAlchemy 2.0 (17 entidades)
│       ├── schemas/                # Validaciones Pydantic v2
│       └── api/v1/endpoints/       # auth, products, producers, orders, admin, catalogs
├── frontend-mobile/                # Aplicación React Native / Expo
│   ├── package.json
│   ├── app.json
│   ├── App.tsx                     # Navegación y AuthProvider
│   └── src/
│       ├── services/api.ts         # Cliente Axios desacoplado
│       ├── context/AuthContext.tsx # Contexto global de sesión
│       └── screens/                # Pantallas Productor y Consumidor
├── frontend-admin/                 # Panel Web Laravel
│   ├── composer.json
│   ├── routes/web.php
│   ├── app/Services/FastApiClient.php # Cliente HTTP hacia FastAPI
│   └── resources/views/            # Vistas Blade con Bootstrap 5
```

---

## 🌿 Flujo de Trabajo Git y Commits

Para mantener trazabilidad limpia por avances:
- Rama principal de producción: `main`
- Ramas por características: `feature/nombre-de-la-funcion` (e.g. `feature/modulo-carrito`)
- Estándar de commits semánticos:
  - `feat:` Nuevas funcionalidades
  - `fix:` Correcciones de errores
  - `docs:` Modificaciones a documentación
  - `refactor:` Mejoras en código sin alterar comportamiento
