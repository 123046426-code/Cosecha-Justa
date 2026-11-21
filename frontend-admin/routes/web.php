<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProducerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\IncidentController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;

Route::get('/', function () {
    return redirect()->route('login');
});

// Autenticación Administrativa
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Rutas protegidas del Panel Administrativo
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Gestión de Productores (RF-ADM-03)
    Route::get('/productores', [ProducerController::class, 'index'])->name('producers.index');
    Route::patch('/productores/{id}/validate', [ProducerController::class, 'validateProducer'])->name('producers.validate');
    
    // Gestión de Usuarios (RF-ADM-02)
    Route::get('/usuarios', [UserController::class, 'index'])->name('users.index');
    Route::patch('/usuarios/{id}/status', [UserController::class, 'toggleStatus'])->name('users.toggle');
    
    // Supervisión de Catálogo y Retiro de Productos (RF-ADM-05)
    Route::get('/productos', [ProductController::class, 'index'])->name('products.index');
    Route::patch('/productos/{id}/retire', [ProductController::class, 'retire'])->name('products.retire');
    
    // Atención de Incidencias (RF-ADM-08)
    Route::get('/incidencias', [IncidentController::class, 'index'])->name('incidents.index');
    Route::patch('/incidencias/{id}/resolve', [IncidentController::class, 'resolve'])->name('incidents.resolve');

    // Gestión de Categorías y Catálogos (RF-ADM-04)
    Route::get('/categorias', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('/categorias', [CategoryController::class, 'store'])->name('categories.store');
    Route::patch('/categorias/{id}/toggle', [CategoryController::class, 'toggle'])->name('categories.toggle');

    // Auditoría y Monitoreo de Pedidos Globales (RF-ADM-06)
    Route::get('/pedidos', [OrderController::class, 'index'])->name('orders.index');

    // Reportes Comerciales y Estadísticas (RF-ADM-07)
    Route::get('/reportes', [ReportController::class, 'index'])->name('reports.index');
});
