<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function response($data = null, $mensagem = 'Sucesso!') {
        return response()->json([
            'data' => $data,
            'mensagem' => $mensagem,
        ]);
    }
}
