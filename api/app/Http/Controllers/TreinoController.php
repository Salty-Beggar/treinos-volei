<?php

namespace App\Http\Controllers;

use App\Models\Treino;
use Illuminate\Http\Request;

class TreinoController extends Controller
{
    public function index(Request $request)
    {
        $query = Treino::query();

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        return response()->json($query->get());
    }
}
