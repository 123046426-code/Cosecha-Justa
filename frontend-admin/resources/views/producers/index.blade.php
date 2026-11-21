@extends('layouts.admin')

@section('title', 'Productores')
@section('page_title', 'Validación y Gestión de Productores (RF-ADM-03)')

@section('content')
<div class="card bg-white p-4">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Negocio / Finca</th>
                    <th>Ubicación</th>
                    <th>Estado de Validación</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse($producers as $p)
                <tr>
                    <td class="fw-bold">#{{ $p['id_productor'] }}</td>
                    <td>
                        <div class="fw-bold">{{ $p['nombre_negocio'] }}</div>
                        <small class="text-muted">{{ $p['descripcion'] }}</small>
                    </td>
                    <td>{{ $p['municipio'] }}, {{ $p['estado'] }}</td>
                    <td>
                        @if($p['estatus_validacion'] === 'validado')
                            <span class="badge bg-success">Validado</span>
                        @elseif($p['estatus_validacion'] === 'pendiente')
                            <span class="badge bg-warning text-dark">Pendiente</span>
                        @else
                            <span class="badge bg-danger">Rechazado</span>
                        @endif
                    </td>
                    <td>
                        <div class="d-flex gap-2">
                            <form action="{{ route('admin.producers.validate', $p['id_productor']) }}" method="POST">
                                @csrf
                                @method('PATCH')
                                <input type="hidden" name="estatus" value="validado">
                                <button class="btn btn-success btn-sm" type="submit" {{ $p['estatus_validacion'] === 'validado' ? 'disabled' : '' }}>
                                    Aprobar
                                </button>
                            </form>
                            <form action="{{ route('admin.producers.validate', $p['id_productor']) }}" method="POST">
                                @csrf
                                @method('PATCH')
                                <input type="hidden" name="estatus" value="rechazado">
                                <button class="btn btn-danger btn-sm" type="submit" {{ $p['estatus_validacion'] === 'rechazado' ? 'disabled' : '' }}>
                                    Rechazar
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">No hay productores registrados.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
