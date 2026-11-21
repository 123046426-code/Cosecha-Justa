<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin') - Cosecha Justa</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        body { background-color: #f1f5f9; font-family: system-ui, -apple-system, sans-serif; }
        .sidebar { min-height: 100vh; background-color: #14532d; color: #fff; }
        .sidebar .nav-link { color: #bbf7d0; font-weight: 500; padding: 12px 18px; border-radius: 8px; margin: 4px 12px; }
        .sidebar .nav-link:hover, .sidebar .nav-link.active { background-color: #166534; color: #fff; }
        .topbar { background-color: #fff; border-bottom: 1px solid #e2e8f0; padding: 14px 24px; }
        .card { border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    </style>
</head>
<body>
<div class="container-fluid p-0">
    <div class="row g-0">
        <!-- Sidebar -->
        <div class="col-md-2 sidebar d-none d-md-block p-3">
            <div class="d-flex align-items-center mb-4 px-2">
                <span class="fs-2 me-2">🌾</span>
                <div>
                    <h5 class="m-0 fw-bold text-white">Cosecha Justa</h5>
                    <small class="text-success-emphasis" style="color: #86efac !important;">Panel Administrador</small>
                </div>
            </div>
            <ul class="nav flex-column">
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" href="{{ route('admin.dashboard') }}">
                        <i class="bi bi-speedometer2 me-2"></i> Dashboard
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('admin.producers.*') ? 'active' : '' }}" href="{{ route('admin.producers.index') }}">
                        <i class="bi bi-person-check me-2"></i> Productores
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('admin.users.*') ? 'active' : '' }}" href="{{ route('admin.users.index') }}">
                        <i class="bi bi-people me-2"></i> Usuarios
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('admin.products.*') ? 'active' : '' }}" href="{{ route('admin.products.index') }}">
                        <i class="bi bi-box-seam me-2"></i> Catálogo Productos
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('admin.orders.*') ? 'active' : '' }}" href="{{ route('admin.orders.index') }}">
                        <i class="bi bi-cart-check me-2"></i> Pedidos Globales
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('admin.categories.*') ? 'active' : '' }}" href="{{ route('admin.categories.index') }}">
                        <i class="bi bi-tags me-2"></i> Categorías
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('admin.reports.*') ? 'active' : '' }}" href="{{ route('admin.reports.index') }}">
                        <i class="bi bi-graph-up me-2"></i> Reportes y Ventas
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ request()->routeIs('admin.incidents.*') ? 'active' : '' }}" href="{{ route('admin.incidents.index') }}">
                        <i class="bi bi-exclamation-triangle me-2"></i> Incidencias
                    </a>
                </li>
            </ul>
        </div>

        <!-- Main Content -->
        <div class="col-md-10">
            <div class="topbar d-flex justify-content-between align-items-center">
                <h5 class="m-0 fw-bold text-secondary">@yield('page_title')</h5>
                <div class="d-flex align-items-center gap-3">
                    <span class="fw-semibold text-dark">{{ Session::get('user_name', 'Administrador') }}</span>
                    <form action="{{ route('logout') }}" method="POST" class="m-0">
                        @csrf
                        <button class="btn btn-outline-danger btn-sm" type="submit">Cerrar Sesión</button>
                    </form>
                </div>
            </div>

            <div class="p-4">
                @if(session('success'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        {{ session('success') }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    </div>
                @endif

                @yield('content')
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
