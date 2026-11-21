@extends('layouts.admin')

@section('title', 'Gestión de Categorías')
@section('page_title', 'Catálogo de Categorías y Sectores')

@section('content')
<div class="row">
    <!-- Formulario para agregar categoría -->
    <div class="col-md-4 mb-4">
        <div class="card p-4 bg-white">
            <h5 class="fw-bold text-success mb-3">➕ Nueva Categoría</h5>
            <form action="{{ route('admin.categories.store') }}" method="POST">
                @csrf
                <div class="mb-3">
                    <label class="form-label fw-semibold small">Nombre de la Categoría</label>
                    <input type="text" name="nombre" class="form-control" placeholder="Ej: Hortalizas, Cítricos, Lácteos" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-semibold small">Tipo de Sector</label>
                    <select name="tipo_sector" class="form-select" required>
                        <option value="agricola">Agrícola (Cultivos, frutas, verduras)</option>
                        <option value="ganadero">Ganadero (Lácteos, carnes, derivados)</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-success w-100 fw-bold">Guardar Categoría</button>
            </form>
        </div>
    </div>

    <!-- Lista de Categorías -->
    <div class="col-md-8">
        <div class="card bg-white p-3">
            <h6 class="fw-bold mb-3 text-secondary">Categorías Existentes</h6>
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Sector</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($categories as $cat)
                            <tr>
                                <td><span class="badge bg-light text-dark border">#{{ $cat['id_categoria'] }}</span></td>
                                <td class="fw-bold">{{ $cat['nombre'] }}</td>
                                <td>
                                    @if($cat['tipo_sector'] === 'agricola')
                                        <span class="badge bg-success-subtle text-success border border-success-subtle">🌾 Agrícola</span>
                                    @else
                                        <span class="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">🥩 Ganadero</span>
                                    @endif
                                </td>
                                <td>
                                    @if($cat['activa'])
                                        <span class="badge bg-success">Activa</span>
                                    @else
                                        <span class="badge bg-secondary">Inactiva</span>
                                    @endif
                                </td>
                                <td>
                                    <form action="{{ route('admin.categories.toggle', $cat['id_categoria']) }}" method="POST" class="d-inline">
                                        @csrf
                                        @method('PATCH')
                                        <input type="hidden" name="activa" value="{{ $cat['activa'] ? 'false' : 'true' }}">
                                        @if($cat['activa'])
                                            <button type="submit" class="btn btn-outline-danger btn-sm">Desactivar</button>
                                        @else
                                            <button type="submit" class="btn btn-outline-success btn-sm">Activar</button>
                                        @endif
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="text-center text-muted py-4">No hay categorías registradas en la plataforma.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
