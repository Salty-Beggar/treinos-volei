<?php

namespace App\Http\Controllers;

use App\Models\HistoricoTreino;
use Illuminate\Http\Request;

class HistoricoTreinoController extends Controller
{
    /**
     * Histórico de treinos de um usuário, do mais recente para o mais antigo.
     *
     * Recebe o usuário por ?user_id=, como o front já faz com /treinos.
     * Quando a API tiver autenticação de verdade, trocar por $request->user().
     */
    public function index(Request $request)
    {
        $dados = $request->validate([
            'user_id' => ['required', 'integer'],
        ]);

        $historico = HistoricoTreino::where('user_id', $dados['user_id'])
            ->orderByDesc('data_execucao')
            ->orderByDesc('id')
            ->get();

        return $this->response($historico);
    }
}
