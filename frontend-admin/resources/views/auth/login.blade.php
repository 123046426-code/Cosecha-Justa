<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso Administrativo - Cosecha Justa</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body { background: linear-gradient(135deg, #14532d, #166534); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        .card-login { max-width: 420px; width: 100%; border-radius: 16px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
    </style>
</head>
<body>
<div class="card card-login p-4 bg-white">
    <div class="text-center mb-4">
        <span class="fs-1">🌾</span>
        <h4 class="fw-bold text-success mt-2">Cosecha Justa</h4>
        <p class="text-muted small">Panel de Administración de la Plataforma (UPQ)</p>
    </div>

    @if($errors->any())
        <div class="alert alert-danger py-2 small">
            @foreach($errors->all() as $err)
                <div>{{ $err }}</div>
            @endforeach
        </div>
    @endif

    <form action="{{ route('login.post') }}" method="POST">
        @csrf
        <div class="mb-3">
            <label class="form-label fw-semibold small">Correo Electrónico</label>
            <input type="email" name="correo" class="form-control" value="admin@cosechajusta.upq.edu.mx" required>
        </div>

        <div class="mb-3">
            <label class="form-label fw-semibold small">Contraseña</label>
            <input type="password" name="contrasena" class="form-control" value="Admin1234*" required>
        </div>

        <button type="submit" class="btn btn-success w-100 py-2 fw-bold mt-2">Iniciar Sesión</button>
    </form>

    <div class="text-center mt-3 pt-3 border-top text-muted small">
        Credenciales por defecto: <code>admin@cosechajusta.upq.edu.mx</code> / <code>Admin1234*</code>
    </div>
</div>
</body>
</html>
