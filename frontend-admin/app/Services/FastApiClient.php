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
        return $this->request()->get("{$this->baseUrl}/admin/dashboard")->json() ?? [];
    }

    // Productores
    public function getProducers(): array
    {
        return $this->request()->get("{$this->baseUrl}/admin/producers")->json() ?? [];
    }

    public function validateProducer(int $id, string $estatus): array
    {
        return $this->request()->patch("{$this->baseUrl}/admin/producers/{$id}/validate?estatus={$estatus}")->json() ?? [];
    }

    // Usuarios
    public function getUsers(): array
    {
        return $this->request()->get("{$this->baseUrl}/admin/users")->json() ?? [];
    }

    public function toggleUserStatus(int $id, bool $activo): array
    {
        return $this->request()->patch("{$this->baseUrl}/admin/users/{$id}/status?activo=" . ($activo ? 'true' : 'false'))->json() ?? [];
    }

    // Productos
    public function getProducts(): array
    {
        return $this->request()->get("{$this->baseUrl}/products")->json() ?? [];
    }

    public function retireProduct(int $id, string $motivo): array
    {
        return $this->request()->patch("{$this->baseUrl}/admin/products/{$id}/retire?motivo=" . urlencode($motivo))->json() ?? [];
    }

    // Incidencias
    public function getIncidents(): array
    {
        return $this->request()->get("{$this->baseUrl}/admin/incidents")->json() ?? [];
    }

    public function resolveIncident(int $id, string $resolucion): array
    {
        return $this->request()->patch("{$this->baseUrl}/admin/incidents/{$id}", [
            'estado' => 'resuelta',
            'resolucion' => $resolucion,
        ])->json() ?? [];
    }
}
