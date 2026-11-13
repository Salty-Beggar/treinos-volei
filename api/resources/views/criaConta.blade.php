<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>Criar Conta</title>
    <link rel="stylesheet" href="/css/style.css">
</head>

<body>

    <div class="card">
        <div class="wrapper">
            <form action="/register" method="POST">
                @csrf
                <div class="form-group">
                    <input type="text" id="usuario" placeholder="Digite seu nome de usuário" name="name">
                </div>

                <div class="form-group">
                    <input type="email" id="email" placeholder="Digite seu e-mail" name="email">
                </div>

                <div class="form-group">
                    <input type="password" id="senha" placeholder="Digite sua senha" name="password">
                </div>
                <button>
                    Cadastrar
                </button>

                <a href="/">Voltar para a página de login</a>
            </form>
        </div>
    </div>
</body>

</html>