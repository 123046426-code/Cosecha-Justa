<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FastApiClient;

class OrderController extends Controller
{
    protected FastApiClient $api;

    public function __construct(FastApiClient $api)
    {
        $this->api = $api;
    }

    public function index(Request $request)
    {
        $estadoId = $request->query('estado_id') ? (int) $request->query('estado_id') : null;
        $orders = $this->api->getAdminOrders($estadoId);
        return view('orders.index', compact('orders', 'estadoId'));
    }
}
