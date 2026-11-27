<?php

use App\Http\Controllers\HistoricoTreinoController;
use Illuminate\Support\Facades\Route;

// Rotas carregadas com o prefixo /api.
// O CORS padrão do Laravel libera api/*, então o front em localhost:5173 consegue chamar.

// Histórico de treinos:
//   GET    /api/historico?user_id=1   lista o histórico do usuário
//   POST   /api/historico             registra um treino concluído
//   GET    /api/historico/{id}        mostra um registro
//   PUT    /api/historico/{id}        edita um registro
//   DELETE /api/historico/{id}        apaga um registro
Route::apiResource('historico', HistoricoTreinoController::class)
    ->missing(fn () => response()->json(['message' => 'Registro do histórico não encontrado.'], 404));
