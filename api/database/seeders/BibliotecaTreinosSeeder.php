<?php

namespace Database\Seeders;

use App\Models\Treino;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Biblioteca de treinos prontos.
 *
 * Cadastra treinos de vôlei pré-prontos, criados pelo próprio sistema.
 * Os treinos ficam ligados a um usuário especial chamado "Sistema".
 *
 * Pode ser rodado várias vezes sem duplicar nada:
 *   php artisan db:seed --class=BibliotecaTreinosSeeder
 */
class BibliotecaTreinosSeeder extends Seeder
{
    /** E-mail do usuário que representa o sistema. */
    public const EMAIL_SISTEMA = 'sistema@treinosvolei.com';

    /**
     * Lista de treinos prontos.
     *
     * tempo:      duração total do treino, em segundos
     * series:     quantas séries
     * intervalo:  descanso entre as séries, em segundos
     * repeticoes: repetições por série
     * video:      link para vídeos de exemplo do exercício
     */
    private const TREINOS = [
        ['nome' => 'Toque de bola na parede',          'tempo' => 600,  'series' => 3, 'intervalo' => 30, 'repeticoes' => 30],
        ['nome' => 'Manchete na parede',               'tempo' => 600,  'series' => 3, 'intervalo' => 30, 'repeticoes' => 30],
        ['nome' => 'Toque e manchete alternados',      'tempo' => 900,  'series' => 4, 'intervalo' => 30, 'repeticoes' => 20],
        ['nome' => 'Saque por baixo',                  'tempo' => 900,  'series' => 3, 'intervalo' => 45, 'repeticoes' => 15],
        ['nome' => 'Saque por cima (tipo tênis)',      'tempo' => 1200, 'series' => 4, 'intervalo' => 45, 'repeticoes' => 12],
        ['nome' => 'Saque viagem',                     'tempo' => 1200, 'series' => 4, 'intervalo' => 60, 'repeticoes' => 10],
        ['nome' => 'Recepção de saque',                'tempo' => 1200, 'series' => 4, 'intervalo' => 45, 'repeticoes' => 15],
        ['nome' => 'Levantamento para a entrada',      'tempo' => 900,  'series' => 3, 'intervalo' => 30, 'repeticoes' => 20],
        ['nome' => 'Passada de ataque',                'tempo' => 900,  'series' => 4, 'intervalo' => 45, 'repeticoes' => 10],
        ['nome' => 'Cortada (ataque)',                 'tempo' => 1500, 'series' => 4, 'intervalo' => 60, 'repeticoes' => 10],
        ['nome' => 'Bloqueio simples',                 'tempo' => 900,  'series' => 4, 'intervalo' => 45, 'repeticoes' => 12],
        ['nome' => 'Deslocamento lateral de bloqueio', 'tempo' => 600,  'series' => 4, 'intervalo' => 30, 'repeticoes' => 16],
        ['nome' => 'Defesa (peixinho e rolamento)',    'tempo' => 1200, 'series' => 3, 'intervalo' => 60, 'repeticoes' => 10],
        ['nome' => 'Saltos verticais (impulsão)',      'tempo' => 600,  'series' => 4, 'intervalo' => 60, 'repeticoes' => 12],
        ['nome' => 'Agachamento com salto',            'tempo' => 600,  'series' => 3, 'intervalo' => 60, 'repeticoes' => 15],
        ['nome' => 'Prancha abdominal',                'tempo' => 300,  'series' => 3, 'intervalo' => 30, 'repeticoes' => 1],
        ['nome' => 'Aquecimento com corda',            'tempo' => 300,  'series' => 3, 'intervalo' => 30, 'repeticoes' => 50],
        ['nome' => 'Alongamento pós-treino',           'tempo' => 600,  'series' => 1, 'intervalo' => 0,  'repeticoes' => 10],
    ];

    public function run(): void
    {
        $sistema = $this->usuarioSistema();

        foreach (self::TREINOS as $dados) {
            // updateOrCreate: se o treino já existe (mesmo nome e mesmo dono),
            // só atualiza os dados; se não existe, cria. Assim não duplica.
            Treino::unguarded(fn () => Treino::updateOrCreate(
                ['user_id' => $sistema->id, 'nome' => $dados['nome']],
                $dados + ['video' => $this->linkVideo($dados['nome'])],
            ));
        }
    }

    /**
     * Busca o usuário "Sistema" ou cria se ainda não existir.
     * A senha é aleatória porque ninguém deve fazer login com ele.
     */
    private function usuarioSistema(): User
    {
        return User::unguarded(fn () => User::firstOrCreate(
            ['email' => self::EMAIL_SISTEMA],
            [
                'name' => 'Sistema',
                'password' => Hash::make(Str::random(40)),
            ],
        ));
    }

    /** Link de busca no YouTube com vídeos do exercício. */
    private function linkVideo(string $nome): string
    {
        return 'https://www.youtube.com/results?search_query='
            . urlencode('vôlei treino ' . $nome);
    }
}
