@extends('layouts.admin')

@section('title', 'Productos')
@section('page_title', 'Supervisión del Catálogo y Retiro de Productos (RF-ADM-05)')

@section('content')
<div class="card bg-white p-4">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Productor</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                @forelse($products as $p)
                <tr>
                    <td>#{{ $p['id_producto'] }}</td>
                    <td>
                        <div class="fw-bold">{{ $p['nombre'] }}</div>
                        <small class="text-muted">{{ $p['nombre_categoria'] }}</small>
                    </td>
                    <td>{{ $p['nombre_productor'] }}</td>
                    <td class="fw-bold text-success">${{ $p['precio'] }} / {{ $p['abreviatura_unidad'] }}</td>
                    <td>{{ $p['cantidad_disponible'] }}</td>
                    <td>
                        <span class="badge {{ $p['estado'] === 'publicado' ? 'bg-success' : ($p['estado'] === 'pausado' ? 'bg-warning text-dark' : 'bg-danger') }}">
                            {{ strtoupper($p['estado']) }}
                        </span>
                    </td>
                    <td>
                        @if($p['estado'] !== 'retirado')
                        <button class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#retireModal{{ $p['id_producto'] }}">
                            Retirar
                        </button>

                        <!-- Modal de Retiro -->
                        <div class="modal fade" id="retireModal{{ $p['id_producto'] }}" tabindex="-1">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <form action="{{ route('admin.products.retire', $p['id_producto']) }}" method="POST">
                                        @csrf
                                        @method('PATCH')
                                        <div class="modal-header">
                                            <h5 class="modal-title">Retirar {{ $p['nombre'] }}</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body">
                                            <label class="form-label small fw-semibold">Motivo del retiro justificado:</label>
                                            <input type="text" name="motivo" class="form-control" placeholder="Ej. Precios especulativos o producto no apto" required>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cancelar</button>
                                            <button type="submit" class="btn btn-danger btn-sm">Confirmar Retiro</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        @else
                            <small class="text-muted">Retirado: {{ $p['motivo_retiro'] }}</small>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="7" class="text-center text-muted py-4">No hay productos en el catálogo.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
