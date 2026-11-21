<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FastApiClient;

class ProducerController extends Controller
{
    protected FastApiClient $api;

    public function __construct(FastApiClient $api)
    {
        $this->api = $api;
    }

    public function index()
    {
        $producers = $this->api->getProducers();
        return view('producers.index', compact('producers'));
    }

    public function validateProducer(Request $request, int $id)
    {
        $request->validate(['estatus' => 'required|in:validado,rechazado,pendiente']);
        $this->api->validateProducer($id, $request->estatus);
        return back()->with('success', "Productor actualizado a estado: {$request->estatus}");
    }
}
