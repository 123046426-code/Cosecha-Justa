<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\FastApiClient;

class ReportController extends Controller
{
    protected FastApiClient $api;

    public function __construct(FastApiClient $api)
    {
        $this->api = $api;
    }

    public function index()
    {
        $report = $this->api->getSalesReport();
        return view('reports.index', compact('report'));
    }
}
