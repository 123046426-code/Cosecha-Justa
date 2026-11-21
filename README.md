# 🌾 Cosecha Justa - Plataforma Tecnológica

> **Proyecto de Estadía - Ingeniería en Sistemas Computacionales**  
> **Universidad Politécnica de Querétaro (UPQ)**

---

## 📌 1. Descripción del Proyecto

**Cosecha Justa** es una plataforma digital orientada a vincular de manera directa a pequeños productores locales agrícolas y ganaderos con consumidores finales. Su objetivo es democratizar el acceso a mercados, transparentar los precios y fomentar el comercio justo sin depender forzosamente de intermediarios comerciales.

---

## 🏛️ 2. Arquitectura Desacoplada del Sistema

El proyecto cumple con la **arquitectura desacoplada obligatoria** especificada en la Ficha Técnica de la UPQ:

```
[ App Móvil - React Native ]         [ Panel Web Admin - Laravel ]
(Productores y Consumidores)             (Administradores)
              │                                   │
              │         (HTTPS / JSON + JWT)      │
              └───────────────┬───────────────────┘
                              ▼
                     [ API REST - FastAPI ]
                   (Validaciones, Roles, Lógica)
                              │
                              ▼ (Asyncpg / SQLAlchemy)
                 [ PostgreSQL 16 Compartido ]
                   (17 Tablas en 3FN + CHECKs)
```

1. **Frontend Móvil (`frontend-mobile/`)**: Aplicación móvil híbrida desarrollada en **React Native / Expo**, con interfaces optimizadas para Productores y Consumidores.
2. **Frontend Web de Administración (`frontend-admin/`)**: Panel web desarrollado en **Laravel** para la supervisión global, aprobación de productores y resolución de incidencias.
3. **Backend API (`backend-api/`)**: API REST desarrollada en **FastAPI (Python)** que centraliza la autenticación mediante tokens JWT, aplica las reglas de negocio e interactúa exclusivamente con la base de datos.
4. **Base de Datos Compartida (`docker/postgres/`)**: **PostgreSQL 16** con 17 tablas normalizadas en 3FN, llaves foráneas con integridad referencial, restricciones CHECK e índices de consulta rápida.

---

## 🐳 3. ¿Lleva Docker?

**Sí, Docker es fundamental en este proyecto.**  
Permite levantar el entorno de desarrollo y pruebas de manera reproducible entre los miembros del equipo:
- Levanta **PostgreSQL 16** con el script de esquema (`01_init_schema.sql`) y catálogos precargados automáticamente.
- Levanta la **API de FastAPI** con hot-reload en `http://localhost:8000`.
- Levanta **pgAdmin 4** en `http://localhost:5050` para inspeccionar la base de datos en entorno gráfico.

### Ejecución con Docker:
```bash
# Iniciar todos los servicios
docker compose up -d --build

# Ver logs de la API y base de datos
docker compose logs -f backend_api

# Detener los servicios
docker compose down
```

---

## 🚀 4. Documentación y Endpoints de la API

Una vez iniciada la API en `http://localhost:8000`:
- **Swagger UI interactivo**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Redoc UI**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📁 5. Estructura del Repositorio

```
cosecha-justa/
├── docker-compose.yml              # Orquestador Docker (Postgres + FastAPI + pgAdmin)
├── .gitignore                      # Reglas de exclusión para Git
├── docker/
│   └── postgres/init/
│       └── 01_init_schema.sql      # Esquema de 17 tablas, checks, índices y semillas
├── backend-api/                    # Núcleo API FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── app/
│       ├── main.py                 # Punto de entrada FastAPI con CORS y rutas
│       ├── core/                   # Configuración, DB async y JWT
│       ├── models/                 # Modelos SQLAlchemy para las 17 tablas
│       ├── schemas/                # Validaciones y esquemas Pydantic v2
│       └── api/v1/endpoints/       # Controladores de Auth, Catálogos, Productos, Pedidos y Admin
├── frontend-admin/                 # Panel Web Laravel
├── frontend-mobile/                # Aplicación Móvil React Native
└── docs/                           # Documentación técnica, diagramas y especificaciones
    └── diagramas/                  # 32 Diagramas de secuencia, casos de uso, componentes y ER
```

---

## 🐙 6. Configuración del Repositorio en GitHub

Para conectar este repositorio local con tu cuenta de GitHub:
```bash
# 1. Crear un repositorio vacío en github.com con el nombre 'cosecha-justa'
# 2. En la terminal de este proyecto ejecutar:
git remote add origin https://github.com/TU_USUARIO/cosecha-justa.git
git branch -M main
git push -u origin main
```
