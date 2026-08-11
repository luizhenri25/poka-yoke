<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Laravel API Security & RBAC Routes (UserRole & UserPermission Enums)
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);
Route::get('/me', [AuthController::class, 'me']);
Route::get('/users', [AuthController::class, 'index']);
Route::post('/users', [AuthController::class, 'store']);
Route::delete('/users/{id}', [AuthController::class, 'destroy']);
