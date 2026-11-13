<?php

namespace App\Http\Controllers;

use App\Models\Treino;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class TreinoController extends Controller
{   
    public function index() {
        $treino = Treino::all();
        return $this->response(
            $treino
        );
    }
    public function show(string $id)
    {
        try {
            $treino = Treino::findOrFail($id);
            return $this->response(
                $treino
            );
        } catch (ModelNotFoundException $e) {
            return $this->response(
                mensagem: 'Treino não encontrado!'
            );
        }
    }

    public function store(Request $request) {
        $request->validate([
            'nome' => 'required',
            'tempo'  => 'required',
            'series' => 'required',
            'intervalo'  => 'required',
            'repeticoes' => 'required',
            'video'  => 'required',
        ]);
        $treino = Treino::create($request->all());
        $treino->user_id = auth()->user()->id;
        return $this->response($treino);
    }
}
