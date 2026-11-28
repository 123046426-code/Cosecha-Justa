<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Administrativo - Cosecha Justa</title>
    <!-- Bootstrap 5 CSS & Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        body {
            background: linear-gradient(135deg, #0f3d1f 0%, #166534 50%, #14532d 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .card-login {
            max-width: 420px;
            width: 100%;
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            background: #ffffff;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
            overflow: hidden;
        }
        .login-header {
            text-align: center;
            padding-bottom: 1.5rem;
        }
        .brand-icon {
            font-size: 3rem;
            display: inline-block;
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
        }
        .form-control:focus {
            border-color: #22c55e;
            box-shadow: 0 0 0 0.25rem rgba(34, 197, 94, 0.25);
        }
        .btn-success {
            background-color: #15803d;
            border-color: #15803d;
            transition: all 0.2s ease-in-out;
        }
        .btn-success:hover {
            background-color: #166534;
            border-color: #166534;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(22, 101, 52, 0.3);
        }
        .toggle-btn {
            border-color: #dee2e6;
            background-color: #f8fafc;
        }
        .toggle-btn:hover {
            background-color: #e2e8f0;
            border-color: #cbd5e1;
        }
        .footer-note {
            font-size: 0.8rem;
            color: #64748b;
            text-align: center;
            margin-top: 1.5rem;
            padding-top: 1rem;
            border-top: 1px solid #f1f5f9;
        }
    </style>
</head>
<body>
<div class="card card-login p-4 p-md-5">
    <div class="login-header">
        <span class="brand-icon">🌾</span>
        <h3 class="fw-bold text-success mt-2 mb-1">Cosecha Justa</h3>
        <p class="text-secondary small mb-0">Panel de Administración y Supervisión</p>
        <span class="badge bg-success-subtle text-success border border-success-subtle mt-2">UPQ · Estadía Profesional</span>
    </div>

    @if($errors->any())
        <div class="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center" role="alert">
            <i class="bi bi-exclamation-circle-fill me-2 fs-5"></i>
            <div>
                @foreach($errors->all() as $err)
                    <div>{{ $err }}</div>
                @endforeach
            </div>
        </div>
    @endif

    <form action="{{ route('login.post') }}" method="POST" novalidate>
        @csrf
        <div class="mb-3">
            <label for="correoInput" class="form-label fw-semibold text-dark small">Correo Electrónico</label>
            <div class="input-group">
                <span class="input-group-text bg-light text-muted"><i class="bi bi-envelope"></i></span>
                <input
                    type="email"
                    id="correoInput"
                    name="correo"
                    class="form-control"
                    placeholder="admin@ejemplo.com"
                    value="{{ old('correo') }}"
                    required
                    autofocus
                    autocomplete="username"
                >
            </div>
        </div>

        <div class="mb-4">
            <label for="passwordInput" class="form-label fw-semibold text-dark small">Contraseña</label>
            <div class="input-group">
                <span class="input-group-text bg-light text-muted"><i class="bi bi-shield-lock"></i></span>
                <input
                    type="password"
                    id="passwordInput"
                    name="contrasena"
                    class="form-control"
                    placeholder="Ingresa tu contraseña"
                    required
                    autocomplete="current-password"
                >
                <button
                    class="btn toggle-btn text-muted"
                    type="button"
                    id="togglePassword"
                    title="Mostrar/Ocultar contraseña"
                    tabindex="-1"
                >
                    <i class="bi bi-eye" id="toggleIcon"></i>
                </button>
            </div>
        </div>

        <button type="submit" class="btn btn-success w-100 py-2 fw-semibold rounded-3 shadow-sm">
            Iniciar Sesión
        </button>
    </form>

    <div class="footer-note">
        Plataforma de Comercio Agrícola Justo &copy; {{ date('Y') }}
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', function () {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('passwordInput');
        const toggleIcon = document.getElementById('toggleIcon');

        if (toggleBtn && passwordInput && toggleIcon) {
            toggleBtn.addEventListener('click', function () {
                const isPassword = passwordInput.getAttribute('type') === 'password';
                passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                
                if (isPassword) {
                    toggleIcon.classList.remove('bi-eye');
                    toggleIcon.classList.add('bi-eye-slash');
                    toggleBtn.setAttribute('title', 'Ocultar contraseña');
                } else {
                    toggleIcon.classList.remove('bi-eye-slash');
                    toggleIcon.classList.add('bi-eye');
                    toggleBtn.setAttribute('title', 'Mostrar contraseña');
                }
                passwordInput.focus();
            });
        }
    });
</script>
</body>
</html>
