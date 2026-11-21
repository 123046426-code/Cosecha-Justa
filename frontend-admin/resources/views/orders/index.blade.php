@extends('layouts.admin')

@section('title', 'Auditoría de Pedidos')
@section('page_title', 'Monitoreo Global de Pedidos y Transacciones')

@section('content')
<div class="card bg-white p-3 mb-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0 text-secondary">Filtro por Estado</h6>
        <div class="btn-group btn-group-sm" role="group">
            <a href="{{ route('admin.orders.index') }}" class="btn {{ is_null($estadoId) ? 'btn-success' : 'btn-outline-secondary' }}">Todos</a>
            <a href="{{ route('admin.orders.index', ['estado_id' => 1]) }}" class="btn {{ $estadoId === 1 ? 'btn-success' : 'btn-outline-secondary' }}">Pendientes</a>
            <a href="{{ route('admin.orders.index', ['estado_id' => 2]) }}" class="btn {{ $estadoId === 2 ? 'btn-success' : 'btn-outline-secondary' }}">Aceptados</a>
            <a href="{{ route('admin.orders.index', ['estado_id' => 4]) }}" class="btn {{ $estadoId === 4 ? 'btn-success' : 'btn-outline-secondary' }}">En Camino</a>
            <a href="{{ route('admin.orders.index', ['estado_id' => 5]) }}" class="btn {{ $estadoId === 5 ? 'btn-success' : 'btn-outline-secondary' }}">Entregados</a>
            <a href="{{ route('admin.orders.index', ['estado_id' => 6]) }}" class="btn {{ $estadoId === 6 ? 'btn-danger' : 'btn-outline-secondary' }}">Cancelados/Rechazados</a>
        </div>
    </div>

    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>Folio</th>
                    <th>Consumidor</th>
                    <th>Productor</th>
                    <th>Total</th>
                    <th>Items</th>
                    <th>Dirección / Entrega</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                </tr>
            </thead>
            <tbody>
                @forelse($orders as $o)
                    <tr>
                        <td><span class="badge bg-light text-dark border">#PED-{{ str_pad($o['id_pedido'], 4, '0', STR_PAD_LEFT) }}</span></td>
                        <td>
                            <div class="fw-bold">{{ $o['nombre_consumidor'] }}</div>
                            <small class="text-muted">ID: {{ $o['id_consumidor'] }}</small>
                        </td>
                        <td>
                            <div class="fw-semibold text-success">{{ $o['nombre_negocio_productor'] }}</div>
                            <small class="text-muted">ID: {{ $o['id_productor'] }}</small>
                        </td>
                        <td class="fw-bold text-dark">${{ number_format($o['total'], 2) }}</td>
                        <td><span class="badge bg-info-subtle text-info-emphasis">{{ $o['total_productos'] }} unids</span></td>
                        <td><small class="text-muted">{{ $o['direccion_entrega'] ?? 'Punto de entrega acordado' }}</small></td>
                        <td>
                            @php
                                $badgeClass = match($o['id_estado']) {
                                    1 => 'bg-warning text-dark',
                                    2 => 'bg-primary text-white',
                                    3 => 'bg-info text-dark',
                                    4 => 'bg-indigo text-white bg-opacity-75',
                                    5 => 'bg-success text-white',
                                    default => 'bg-danger text-white'
                                };
                            @endphp
                            <span class="badge {{ $badgeClass }}">{{ ucfirst($o['nombre_estado']) }}</span>
                            @if(!empty($o['motivo_rechazo']))
                                <div class="small text-danger mt-1">Motivo: {{ $o['motivo_rechazo'] }}</div>
                            @endif
                        </td>
                        <td><small class="text-muted">{{ \Carbon\Carbon::parse($o['fecha_pedido'])->format('d/m/Y H:i') }}</small></td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="8" class="text-center text-muted py-4">No se encontraron pedidos con el criterio seleccionado.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
