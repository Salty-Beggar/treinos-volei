<?php

use App\Http\Controllers\TreinoController;
use App\Http\Controllers\userController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {return view('login');});
Route::get('/criaConta', function () {return view('criaConta');});


Route::post('/login', [userController::class, 'login']);
Route::post('/register', [userController::class, 'register']);

Route::get('/treinos', [TreinoController::class, 'index']);
Route::get('/treinos/{id}', [TreinoController::class, 'show']);
Route::post('/create', [TreinoController::class, 'create']);
Route::put('/update/{id}', [TreinoController::class, 'update']);
Route::delete('/delete/{id}', [TreinoController::class, 'delete']);
