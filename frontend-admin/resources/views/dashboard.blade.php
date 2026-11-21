@extends('layouts.admin')

@section('title', 'Dashboard')
@section('page_title', 'Resumen General del Sistema')

@section('content')
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card p-3 bg-white">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="text-muted small">Transacciones Totales</div>
                    <h3 class="fw-bold text-success mb-0">${{ number_format($metrics['monto_total_transacciones'] ?? 0, 2) }}</h3>
                </div>
                <div class="fs-1 text-success opacity-50">💰</div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card p-3 bg-white">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="text-muted small">Productores Registrados</div>
                    <h3 class="fw-bold text-primary mb-0">{{ $metrics['total_productores'] ?? 0 }}</h3>
                </div>
                <div class="fs-1 text-primary opacity-50">👨‍🌾</div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card p-3 bg-white">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="text-muted small">Productos Activos</div>
                    <h3 class="fw-bold text-info mb-0">{{ $metrics['total_productos_activos'] ?? 0 }}</h3>
                </div>
                <div class="fs-1 text-info opacity-50">📦</div>
            </div>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card p-3 bg-white">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <div class="text-muted small">Incidencias Abiertas</div>
                    <h3 class="fw-bold text-danger mb-0">{{ $metrics['incidencias_abiertas'] ?? 0 }}</h3>
                </div>
                <div class="fs-1 text-danger opacity-50">⚠️</div>
            </div>
        </div>
    </div>
</div>

<div class="card p-4 bg-white">
    <h6 class="fw-bold mb-3 text-secondary">Arquitectura Desacoplada y Estado del Backend</h6>
    <p class="text-muted small mb-2">
        Este panel se comunica directamente con la API RESTful desarrollada en <strong>FastAPI</strong>, consumiendo endpoints con tokens Bearer JWT y sin conexión directa a PostgreSQL.
    </p>
    <div class="d-flex gap-2">
        <a href="http://localhost:8000/docs" target="_blank" class="btn btn-outline-success btn-sm">
            <i class="bi bi-box-arrow-up-right"></i> Ver Swagger API Docs (Port 8000)
        </a>
        <a href="http://localhost:5050" target="_blank" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-database"></i> Acceder a pgAdmin (Port 5050)
        </a>
    </div>
</div>
@endsection
