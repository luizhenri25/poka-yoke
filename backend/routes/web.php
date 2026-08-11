<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;

Route::get('/', function () {
    return response()->json([
        'system' => 'POKA-YOKE Security & Notifications API (Forvia Faurecia)',
        'backend' => 'Laravel 13 (PHP 8.5)',
        'enums' => [
            'UserRole' => ['admin', 'engenheiro', 'operador'],
            'UserPermission' => ['view_instructions', 'sign_training', 'manage_poka_yokes', 'manage_users', 'view_analytics', 'generate_documents']
        ]
    ]);
});

Route::prefix('api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/users', [AuthController::class, 'index']);
    Route::post('/users', [AuthController::class, 'store']);
    Route::delete('/users/{id}', [AuthController::class, 'destroy']);
    
    // Notificações de Vencimento de Poka-Yoke por E-mail
    Route::post('/notifications/send-email', [NotificationController::class, 'sendExpirationAlerts']);
});
