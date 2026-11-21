@extends('layouts.admin')

@section('title', 'Usuarios')
@section('page_title', 'Administración de Usuarios (RF-ADM-02)')

@section('content')
<div class="card bg-white p-4">
    <div class="table-responsive">
        <table class="table table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th>ID</th>
                    <th>Nombre Completo</th>
                    <th>Correo Electrónico</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
                @forelse($users as $u)
                <tr>
                    <td>#{{ $u['id_usuario'] }}</td>
                    <td class="fw-bold">{{ $u['nombre'] }} {{ $u['apellidos'] }}</td>
                    <td>{{ $u['correo'] }}</td>
                    <td>
                        @if($u['id_rol'] === 1)
                            <span class="badge bg-dark">Administrador</span>
                        @elseif($u['id_rol'] === 2)
                            <span class="badge bg-success">Productor</span>
                        @else
                            <span class="badge bg-info text-dark">Consumidor</span>
                        @endif
                    </td>
                    <td>
                        <span class="badge {{ $u['activo'] ? 'bg-success' : 'bg-secondary' }}">
                            {{ $u['activo'] ? 'Activo' : 'Inactivo' }}
                        </span>
                    </td>
                    <td>
                        <form action="{{ route('admin.users.toggle', $u['id_usuario']) }}" method="POST">
                            @csrf
                            @method('PATCH')
                            <input type="hidden" name="activo" value="{{ $u['activo'] ? 'false' : 'true' }}">
                            <button class="btn btn-sm {{ $u['activo'] ? 'btn-outline-danger' : 'btn-outline-success' }}" type="submit">
                                {{ $u['activo'] ? 'Desactivar' : 'Activar' }}
                            </button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">No se encontraron usuarios.</td>
                </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
@endsection
