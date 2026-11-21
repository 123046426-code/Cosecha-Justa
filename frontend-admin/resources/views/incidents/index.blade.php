@extends('layouts.admin')

@section('title', 'Incidencias')
@section('page_title', 'Gestión y Resolución de Incidencias (RF-ADM-08)')

@section('content')
<div class="card bg-white p-4">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Descripción de la queja</th>
                    <th>Estado</th>
                    <th>Fecha de Reporte</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                @forelse($incidents as $inc)
                <tr>
                    <td>#{{ $inc['id_incidencia'] }}</td>
                    <td>
                        <div>{{ $inc['descripcion'] }}</div>
                        @if($inc['resolucion'])
                            <small class="text-success"><strong>Resolución:</strong> {{ $inc['resolucion'] }}</small>
                        @endif
                    </td>
                    <td>
                        <span class="badge {{ $inc['estado'] === 'resuelta' ? 'bg-success' : 'bg-warning text-dark' }}">
                            {{ strtoupper($inc['estado']) }}
                        </span>
                    </td>
                    <td>{{ \Carbon\Carbon::parse($inc['fecha_reporte'])->format('d/m/Y H:i') }}</td>
                    <td>
                        @if($inc['estado'] !== 'resuelta')
                            <form action="{{ route('admin.incidents.resolve', $inc['id_incidencia']) }}" method="POST" class="d-flex gap-2">
                                @csrf
                                @method('PATCH')
                                <input type="text" name="resolucion" class="form-control form-control-sm" placeholder="Dictamen de resolución" required>
                                <button class="btn btn-success btn-sm" type="submit">Resolver</button>
                            </form>
                        @else
                            <span class="text-muted small">Atendido</span>
                        @endif
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="text-center text-muted py-4">No hay incidencias reportadas.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
