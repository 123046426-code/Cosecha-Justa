<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FastApiClient;

class CategoryController extends Controller
{
    protected FastApiClient $api;

    public function __construct(FastApiClient $api)
    {
        $this->api = $api;
    }

    public function index()
    {
        $categories = $this->api->getCategories();
        return view('categories.index', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:60',
            'tipo_sector' => 'required|in:agricola,ganadero',
        ]);

        $this->api->createCategory($request->nombre, $request->tipo_sector, true);
        return back()->with('success', 'Categoría agregada exitosamente.');
    }

    public function toggle(Request $request, int $id)
    {
        $activa = filter_var($request->activa, FILTER_VALIDATE_BOOLEAN);
        $this->api->updateCategory($id, ['activa' => $activa]);
        return back()->with('success', 'Estado de la categoría actualizado.');
    }
}
