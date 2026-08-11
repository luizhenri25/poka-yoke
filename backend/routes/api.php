<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| Laravel API Security & Notifications Routes (PHP 8.5 Enums)
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::get('/me', [AuthController::class, 'me']);
Route::get('/users', [AuthController::class, 'index']);
Route::post('/users', [AuthController::class, 'store']);
Route::delete('/users/{id}', [AuthController::class, 'destroy']);

// Notificações de Vencimento de Poka-Yoke por E-mail
Route::post('/notifications/send-email', [NotificationController::class, 'sendExpirationAlerts']);
