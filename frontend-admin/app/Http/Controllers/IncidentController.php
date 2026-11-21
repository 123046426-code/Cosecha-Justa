<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FastApiClient;

class IncidentController extends Controller
{
    protected FastApiClient $api;

    public function __construct(FastApiClient $api)
    {
        $this->api = $api;
    }

    public function index()
    {
        $incidents = $this->api->getIncidents();
        return view('incidents.index', compact('incidents'));
    }

    public function resolve(Request $request, int $id)
    {
        $request->validate(['resolucion' => 'required|string']);
        $this->api->resolveIncident($id, $request->resolucion);
        return back()->with('success', 'Incidencia resuelta satisfactoriamente.');
    }
}
