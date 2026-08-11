<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Middleware\SecurityHeaders;

Route::middleware([SecurityHeaders::class])->group(function () {

    Route::get('/', function () {
        return response()->json([
            'system' => 'POKA-YOKE Pentest Hardened API (Forvia Faurecia)',
            'backend' => 'Laravel 13 (PHP 8.5)',
            'security' => [
                'rate_limiting' => 'Active (5 attempts/min)',
                'headers' => ['X-Frame-Options: DENY', 'X-Content-Type-Options: nosniff', 'CSP', 'HSTS'],
                'enums' => ['UserRole', 'UserPermission']
            ]
        ]);
    });

    Route::prefix('api')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/users', [AuthController::class, 'index']);
        Route::post('/users', [AuthController::class, 'store']);
        Route::delete('/users/{id}', [AuthController::class, 'destroy']);
        Route::post('/notifications/send-email', [NotificationController::class, 'sendExpirationAlerts']);
    });

});
