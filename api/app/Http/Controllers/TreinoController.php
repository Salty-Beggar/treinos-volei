<?php

namespace App\Http\Controllers;
use App\Models\Treino;
use Illuminate\Http\Request;

class TreinoController extends Controller
{   
    public function index() {
        $user = auth()->user();
        $treinos = Treino::where('user_id', $user->id)->get();
        return response()->json($treinos);
    }

    public function show($id) {
        $user = auth()->user();
        $treino = Treino::find($id);

        if (!$treino) {return response()->json(['message' => 'Treino não encontrado.'], 404);}
        if ($treino->user_id !== $user->id) { return response()->json(['message' => 'Você não tem permissão para acessar este treino.'], 403);}
        
        return response()->json($treino);
    }

    public function create(Request $request) {
        $user = auth()->user();
        $treino = new Treino();
        $treino->nome = $request->input('nome');
        $treino->tempo = $request->input('tempo');
        $treino->video = $request->input('video');
        $treino->series = $request->input('series');
        $treino->intervalo = $request->input('intervalo');
        $treino->repeticoes = $request->input('repeticoes');
        $treino->user_id = $user->id;
        $treino->save();
        return response()->json(['message' => 'Treino criado com sucesso!']);
    }

  public function update(Request $request, $id) {
        $user = auth()->user();
        $treino = Treino::find($id);

        if (!$treino) {return response()->json(['message' => 'Treino não encontrado.'], 404);}
        if ($treino->user_id !== $user->id) { return response()->json(['message' => 'Você não tem permissão para atualizar este treino.'], 403);}
        
        $treino->nome = $request->input('nome');
        $treino->tempo = $request->input('tempo');
        $treino->series = $request->input('series');
        $treino->intervalo = $request->input('intervalo');
        $treino->repeticoes = $request->input('repeticoes');
        $treino->video = $request->input('video');
        $treino->save();
        return response()->json(['message' => 'Treino atualizado com sucesso!']);
    }

    public function delete($id) {
        $user = auth()->user();
        $treino = Treino::findOrFail($id)->first();

        if (!$treino) {return response()->json(['message' => 'Treino não encontrado.'], 404);}
        else if($treino->user_id !== $user->id) { return response()->json(['message' => 'Você não tem permissão para deletar este treino.'], 403);}
        
        $treino->delete();
        return response()->json(['message' => 'Treino deletado com sucesso!']);
    }

}
