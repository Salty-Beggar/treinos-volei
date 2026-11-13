<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TreinoController extends Controller
{   
    public function index() {
        $treino = Treino::all();
        return response()->json($treino);
    }
}
