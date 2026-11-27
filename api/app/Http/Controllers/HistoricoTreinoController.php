<?php

namespace App\Http\Controllers;

use App\Models\HistoricoTreino;
use Illuminate\Http\Request;

/**
 * Gerenciamento do histórico de treinos.
 *
 * O usuário vem em user_id (na listagem e no registro), como o front já faz com /treinos.
 * Quando a API tiver autenticação de verdade, trocar por $request->user() e
 * conferir se o registro pertence a quem está logado antes de mostrar/editar/apagar.
 */
class HistoricoTreinoController extends Controller
{
    /**
     * Histórico de um usuário, do mais recente para o mais antigo.
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

    /**
     * Registra um treino concluído. Sem data_execucao, o banco usa a data/hora atual.
     */
    public function store(Request $request)
    {
        $dados = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'nome' => ['required', 'string', 'max:100'],
            'duracao_minutos' => ['required', 'integer', 'min:1'],
            'data_execucao' => ['sometimes', 'date'],
        ]);

        // refresh() recarrega o registro para trazer a data preenchida pelo banco.
        $registro = HistoricoTreino::create($dados)->refresh();

        return $this->response($registro, 'Treino registrado no histórico!')
            ->setStatusCode(201);
    }

    public function show(HistoricoTreino $historico)
    {
        return $this->response($historico);
    }

    /**
     * Edita nome, duração e/ou data. O dono do registro (user_id) não muda.
     */
    public function update(Request $request, HistoricoTreino $historico)
    {
        $dados = $request->validate([
            'nome' => ['sometimes', 'string', 'max:100'],
            'duracao_minutos' => ['sometimes', 'integer', 'min:1'],
            'data_execucao' => ['sometimes', 'date'],
        ]);

        $historico->update($dados);

        return $this->response($historico, 'Registro do histórico atualizado!');
    }

    public function destroy(HistoricoTreino $historico)
    {
        $historico->delete();

        return $this->response(mensagem: 'Registro removido do histórico!');
    }
}
