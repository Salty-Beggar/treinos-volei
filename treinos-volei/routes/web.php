<?php

use App\Http\Controllers\userController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {return view('login');});
Route::get('/criaConta', function () {return view('criaConta');});


Route::post('/login', [userController::class, 'login']);
Route::post('/register', [userController::class, 'register']);
