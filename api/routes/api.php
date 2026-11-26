<?php

use App\Http\Controllers\TreinoController;
use Illuminate\Support\Facades\Route;

Route::get('/treinos', [TreinoController::class, 'index']);
