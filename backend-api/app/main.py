from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API RESTful desacoplada para la plataforma Cosecha Justa (UPQ Estadía 2026). Conecta de forma segura y centralizada la aplicación móvil (React Native) y el panel web administrativo (Laravel) con la base de datos PostgreSQL.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configuración de Middleware CORS para Arquitectura Desacoplada
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión del Router v1
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health Check"])
async def root():
    return {
        "sistema": settings.PROJECT_NAME,
        "version": "1.0.0",
        "arquitectura": "Desacoplada (FastAPI + PostgreSQL + Laravel + React Native)",
        "estado": "En ejecución",
        "docs": "/docs"
    }

@app.get("/health", tags=["Health Check"])
async def health():
    return {"status": "ok"}
