<?php

use App\Http\Controllers\HistoricoTreinoController;
use Illuminate\Support\Facades\Route;

// Rotas carregadas com o prefixo /api (ex.: GET /api/historico).
// O CORS padrão do Laravel libera api/*, então o front em localhost:5173 consegue chamar.
Route::get('/historico', [HistoricoTreinoController::class, 'index']);
