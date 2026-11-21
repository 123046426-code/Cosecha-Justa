<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FastApiClient;

class UserController extends Controller
{
    protected FastApiClient $api;

    public function __construct(FastApiClient $api)
    {
        $this->api = $api;
    }

    public function index()
    {
        $users = $this->api->getUsers();
        return view('users.index', compact('users'));
    }

    public function toggleStatus(Request $request, int $id)
    {
        $activo = filter_var($request->activo, FILTER_VALIDATE_BOOLEAN);
        $this->api->toggleUserStatus($id, $activo);
        return back()->with('success', 'Estatus de usuario actualizado.');
    }
}
