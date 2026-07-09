<?php

use App\Http\Controllers\TicketController;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/tickets', [TicketController::class, 'index']);
Route::post('/tickets', [TicketController::class, 'store'])->withoutMiddleware([VerifyCsrfToken::class]);
Route::put('/tickets/{id}', [TicketController::class, 'update'])->withoutMiddleware([VerifyCsrfToken::class]);
Route::delete('/tickets/{id}', [TicketController::class, 'destroy'])->withoutMiddleware([VerifyCsrfToken::class]);
Route::get('/tickets/{id}', [TicketController::class, 'show']);

Route::post('/login',[AuthController::class,'login'])->withoutMiddleware([VerifyCsrfToken::class]);

Route::post('/logout',[AuthController::class,'logout'])->withoutMiddleware([VerifyCsrfToken::class]);