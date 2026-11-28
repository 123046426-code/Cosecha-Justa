<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class FastApiClient
{
    protected string $baseUrl;

    public function __construct()
    {
        $this->baseUrl = env('FASTAPI_BASE_URL', 'http://localhost:8000/api/v1');
    }

    /**
     * Autenticación contra FastAPI
     */
    public function login(string $correo, string $contrasena): array
    {
        $response = Http::post("{$this->baseUrl}/auth/login", [
            'correo' => $correo,
            'contrasena' => $contrasena,
        ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception($response->json('detail') ?? 'Credenciales no válidas.');
    }

    /**
     * Helper para peticiones autenticadas con Bearer JWT
     */
    protected function request()
    {
        $token = Session::get('jwt_token');
        return Http::withToken($token);
    }

    // Dashboard
    public function getDashboardMetrics(): array
    {
        $res = $this->request()->get("{$this->baseUrl}/admin/dashboard");
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    // Productores
    public function getProducers(): array
    {
        $res = $this->request()->get("{$this->baseUrl}/admin/producers");
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    public function validateProducer(int $id, string $estatus): array
    {
        $res = $this->request()->patch("{$this->baseUrl}/admin/producers/{$id}/validate?estatus={$estatus}");
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    // Usuarios
    public function getUsers(): array
    {
        $res = $this->request()->get("{$this->baseUrl}/admin/users");
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    public function toggleUserStatus(int $id, bool $activo): array
    {
        $res = $this->request()->patch("{$this->baseUrl}/admin/users/{$id}/status?activo=" . ($activo ? 'true' : 'false'));
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    // Productos
    public function getProducts(): array
    {
        $res = $this->request()->get("{$this->baseUrl}/products");
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    public function retireProduct(int $id, string $motivo): array
    {
        $res = $this->request()->patch("{$this->baseUrl}/admin/products/{$id}/retire?motivo=" . urlencode($motivo));
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    // Incidencias
    public function getIncidents(): array
    {
        $res = $this->request()->get("{$this->baseUrl}/admin/incidents");
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    public function resolveIncident(int $id, string $resolucion): array
    {
        $res = $this->request()->patch("{$this->baseUrl}/admin/incidents/{$id}", [
            'estado' => 'resuelta',
            'resolucion' => $resolucion,
        ]);
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    // Categorías y Catálogos (RF-ADM-04)
    public function getCategories(): array
    {
        $res = $this->request()->get("{$this->baseUrl}/admin/categories");
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    public function createCategory(string $nombre, string $tipoSector, bool $activa = true): array
    {
        $res = $this->request()->post("{$this->baseUrl}/admin/categories", [
            'nombre' => $nombre,
            'tipo_sector' => $tipoSector,
            'activa' => $activa,
        ]);
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    public function updateCategory(int $id, array $data): array
    {
        $res = $this->request()->patch("{$this->baseUrl}/admin/categories/{$id}", $data);
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    // Pedidos Globales (RF-ADM-06)
    public function getAdminOrders(?int $estadoId = null): array
    {
        $url = "{$this->baseUrl}/admin/orders";
        if ($estadoId) {
            $url .= "?estado_id={$estadoId}";
        }
        $res = $this->request()->get($url);
        return $res->successful() ? ($res->json() ?? []) : [];
    }

    // Reportes Comerciales y Financieros (RF-ADM-07)
    public function getSalesReport(): array
    {
        $res = $this->request()->get("{$this->baseUrl}/admin/reports/sales");
        return $res->successful() ? ($res->json() ?? []) : [];
    }
}
