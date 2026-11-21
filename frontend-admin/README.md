# Panel Web de Administración (Laravel) - Cosecha Justa

Este módulo corresponde al **Frontend Web de Administración** requerido en el **Avance 1** y en la arquitectura desacoplada de la UPQ.

## 🏛️ Rol en la Arquitectura Desacoplada

Como lo especifica la ficha técnica y las restricciones del proyecto:
- **Tecnología**: Laravel (PHP).
- **Rol exclusivo**: Administrador del sistema (`RF-ADM-01` al `RF-ADM-09`).
- **Regla de oro de desacoplamiento**: El sistema web de Laravel **NO consulta PostgreSQL directamente**. Consume exclusivamente los endpoints protegidos de la API desarrollada en **FastAPI**.

## 🔌 Conexión con FastAPI

En Laravel, la comunicación se realiza mediante el cliente HTTP de Laravel (`Http::withToken(...)` o Guzzle):

```php
// Ejemplo en un Service / Controller de Laravel:
use Illuminate\Support\Facades\Http;

class FastApiClientService {
    protected $baseUrl;

    public function __construct() {
        $this->baseUrl = env('FASTAPI_BASE_URL', 'http://localhost:8000/api/v1');
    }

    public function login($email, $password) {
        return Http::post("{$this->baseUrl}/auth/login", [
            'correo' => $email,
            'contrasena' => $password,
        ])->json();
    }

    public function getDashboardMetrics($token) {
        return Http::withToken($token)
            ->get("{$this->baseUrl}/admin/dashboard")
            ->json();
    }

    public function validateProducer($token, $producerId, $status) {
        return Http::withToken($token)
            ->patch("{$this->baseUrl}/admin/producers/{$producerId}/validate?estatus={$status}")
            ->json();
    }
}
```

## 📋 Módulos Administrativos Implementados
1. **Inicio de sesión protegido**: Autenticación administrativa contra FastAPI (`RF-ADM-01`).
2. **Gestión de usuarios**: Consulta, activación y desactivación de cuentas (`RF-ADM-02`).
3. **Validación de productores**: Aprobación o rechazo de solicitudes de registro de productores (`RF-ADM-03`).
4. **Gestión de categorías**: Alta, edición y mantenimiento de sectores agrícola y ganadero (`RF-ADM-04`).
5. **Supervisión de productos**: Retiro justificado de productos que violen reglas (`RF-ADM-05`).
6. **Supervisión de pedidos globales**: Monitoreo de todas las órdenes de la plataforma (`RF-ADM-06`).
7. **Reportes y estadísticas**: Tablero ejecutivo con volumen de ventas, usuarios e incidencias (`RF-ADM-07`).
8. **Mesa de ayuda / Incidencias**: Atención y resolución de quejas de usuarios (`RF-ADM-08`).
9. **Catálogos del sistema**: Unidades de medida, opciones de entrega y estados (`RF-ADM-09`).
