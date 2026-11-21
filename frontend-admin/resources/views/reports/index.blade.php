@extends('layouts.admin')

@section('title', 'Reportes Comerciales')
@section('page_title', 'Reporte Consolidado de Ventas y Rendimiento')

@section('content')
<!-- Tarjetas Resumen -->
<div class="row g-3 mb-4">
    <div class="col-md-3">
        <div class="card p-3 bg-white">
            <div class="text-muted small">Volumen Total Facturado</div>
            <h3 class="fw-bold text-success mb-0">${{ number_format($report['monto_total_ventas'] ?? 0, 2) }}</h3>
            <small class="text-muted">Pedidos finalizados</small>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card p-3 bg-white">
            <div class="text-muted small">Pedidos Entregados</div>
            <h3 class="fw-bold text-primary mb-0">{{ $report['total_pedidos_cerrados'] ?? 0 }}</h3>
            <small class="text-muted">Tasa de éxito operativa</small>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card p-3 bg-white">
            <div class="text-muted small">Ticket Promedio</div>
            <h3 class="fw-bold text-info mb-0">${{ number_format($report['ticket_promedio'] ?? 0, 2) }}</h3>
            <small class="text-muted">Por transacción efectiva</small>
        </div>
    </div>
    <div class="col-md-3">
        <div class="card p-3 bg-white">
            <div class="text-muted small">Distribución por Sector</div>
            <div class="d-flex justify-content-between mt-2">
                <span class="small fw-semibold text-success">🌾 Agrícola: ${{ number_format($report['ventas_agricolas'] ?? 0, 0) }}</span>
                <span class="small fw-semibold text-warning-emphasis">🥩 Ganadero: ${{ number_format($report['ventas_ganaderas'] ?? 0, 0) }}</span>
            </div>
        </div>
    </div>
</div>

<!-- Tabla Top Productores -->
<div class="card bg-white p-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold text-dark m-0">🏆 Productores con Mayor Volumen de Venta</h5>
        <button class="btn btn-outline-success btn-sm" onclick="window.print()">
            <i class="bi bi-printer me-1"></i> Imprimir Reporte
        </button>
    </div>
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Ranking</th>
                    <th>Negocio / Productor</th>
                    <th>Municipio / Región</th>
                    <th>Pedidos Concluidos</th>
                    <th>Total Facturado</th>
                </tr>
            </thead>
            <tbody>
                @forelse($report['top_productores'] ?? [] as $index => $prod)
                    <tr>
                        <td>
                            @if($index === 0)
                                <span class="badge bg-warning text-dark fs-6">🥇 1º</span>
                            @elseif($index === 1)
                                <span class="badge bg-secondary text-white fs-6">🥈 2º</span>
                            @elseif($index === 2)
                                <span class="badge bg-danger-subtle text-danger-emphasis fs-6">🥉 3º</span>
                            @else
                                <span class="badge bg-light text-dark border">#{{ $index + 1 }}</span>
                            @endif
                        </td>
                        <td class="fw-bold text-success">{{ $prod['nombre_negocio'] }}</td>
                        <td>{{ $prod['municipio'] }}</td>
                        <td><span class="badge bg-primary-subtle text-primary">{{ $prod['pedidos_cerrados'] }} pedidos</span></td>
                        <td class="fw-bold text-dark">${{ number_format($prod['ventas_totales'], 2) }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center text-muted py-4">No se registran ventas concluidas suficientes para el ranking.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
