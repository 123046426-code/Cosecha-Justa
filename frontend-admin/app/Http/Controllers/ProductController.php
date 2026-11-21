<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FastApiClient;

class ProductController extends Controller
{
    protected FastApiClient $api;

    public function __construct(FastApiClient $api)
    {
        $this->api = $api;
    }

    public function index()
    {
        $products = $this->api->getProducts();
        return view('products.index', compact('products'));
    }

    public function retire(Request $request, int $id)
    {
        $request->validate(['motivo' => 'required|string|max:200']);
        $this->api->retireProduct($id, $request->motivo);
        return back()->with('success', 'Producto retirado del catálogo por incumplimiento.');
    }
}
