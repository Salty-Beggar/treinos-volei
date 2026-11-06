<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="/css/style.css">

</head>

<body>

    <div class="card">
        <div class="wrapper">
            <form action="/login" method="POST">
                @csrf
                <div class="form-group">
                    <input type="text" id="usuario" placeholder="Digite seu e-mail" name="email">
                </div>
                
                <div class="form-group">
                    <input type="password" id="senha" placeholder="Digite sua senha" name="password">
                </div>

                <button type="submit">Cadastrar</button>
                <a href="/criaConta">Não tem uma conta? Crie uma aqui</a>
            </form>
        </div>
    </div>
</body>

</html>