<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthMiddleware
{
    /**
     * Asegura que el usuario tenga un token JWT activo en sesión
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Session::has('jwt_token')) {
            return redirect()->route('login')->withErrors([
                'correo' => 'Debes iniciar sesión con una cuenta de Administrador para acceder.'
            ]);
        }

        return $next($request);
    }
}
