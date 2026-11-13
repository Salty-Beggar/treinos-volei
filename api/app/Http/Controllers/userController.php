<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class userController extends Controller
{

    public function login(Request $request){
        
        $email = $request->input('email');
        $senha = $request->input('password');

        if (!$email || !$senha) {
            return response()->json(['message' => 'Preencha todos os campos.'], 400);
        }

        $user = User::where('email', $email)->first();

        if ($user && $senha === $user->senha) {
            auth()->login($user);
            return response()->json(['message' => 'Login realizado com sucesso!']);
        }
        else {
            return response()->json(['message' => 'Usuário ou senha incorretos.'], 401);
        }
    }

    public function register(Request $request)
    {
        $nome = $request->input('name');
        $email = $request->input('email');
        $senha = $request->input('password');

        if (!$nome || !$email || !$senha ) {return response()->json(['message' => 'Preencha todos os campos.'], 400);}


        $testeEmail = User::where('email', $email)->first();
        if ($testeEmail) {
            return response()->json(['message' => 'O e-mail informado já está em uso.'], 400);
        }
        $testeNome = User::where('nome', $nome)->first();
        if ($testeNome) {
            return response()->json(['message' => 'O nome de usuário informado já está em uso.'], 400);
        }

        $user = User::create([
            'nome' => $nome,
            'email' => $email,
            'senha' => $senha
        ]);

        return response()->json(['message' => 'Usuário cadastrado com sucesso!']);
    }
}
