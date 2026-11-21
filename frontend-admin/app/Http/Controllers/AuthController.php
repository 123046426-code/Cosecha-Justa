<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use App\Services\FastApiClient;

class AuthController extends Controller
{
    protected FastApiClient $api;

    public function __construct(FastApiClient $api)
    {
        $this->api = $api;
    }

    public function showLogin()
    {
        if (Session::has('jwt_token')) {
            return redirect()->route('admin.dashboard');
        }
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'correo' => 'required|email',
            'contrasena' => 'required',
        ]);

        try {
            $data = $this->api->login($request->correo, $request->contrasena);

            // Validar que sea administrador (role_id === 1)
            if ($data['role_id'] !== 1) {
                return back()->withErrors(['correo' => 'Acceso exclusivo para administradores de la plataforma.']);
            }

            Session::put('jwt_token', $data['access_token']);
            Session::put('user_name', $data['name']);
            Session::put('user_id', $data['user_id']);

            return redirect()->route('admin.dashboard');
        } catch (\Exception $e) {
            return back()->withErrors(['correo' => $e->getMessage()]);
        }
    }

    public function logout()
    {
        Session::flush();
        return redirect()->route('login');
    }
}
