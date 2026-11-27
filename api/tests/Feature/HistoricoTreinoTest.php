<?php

namespace Tests\Feature;

use App\Models\HistoricoTreino;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HistoricoTreinoTest extends TestCase
{
    use RefreshDatabase;

    public function test_lista_so_o_historico_do_usuario_do_mais_recente_para_o_mais_antigo(): void
    {
        $usuario = User::factory()->create();
        $outroUsuario = User::factory()->create();

        HistoricoTreino::factory()->for($usuario)->create([
            'nome' => 'Saque flutuante por zonas',
            'data_execucao' => '2026-11-20 10:00:00',
        ]);
        HistoricoTreino::factory()->for($usuario)->create([
            'nome' => 'Deslocamento para bloqueio',
            'data_execucao' => '2026-11-25 18:30:00',
        ]);
        HistoricoTreino::factory()->for($outroUsuario)->create();

        $this->getJson("/api/historico?user_id={$usuario->id}")
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('data.0.nome', 'Deslocamento para bloqueio')
            ->assertJsonPath('data.1.nome', 'Saque flutuante por zonas');
    }

    public function test_user_id_e_obrigatorio(): void
    {
        $this->getJson('/api/historico')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('user_id');
    }

    public function test_data_execucao_usa_a_data_atual_quando_nao_informada(): void
    {
        $usuario = User::factory()->create();

        $registro = HistoricoTreino::create([
            'user_id' => $usuario->id,
            'nome' => 'Manchete na parede',
            'duracao_minutos' => 20,
        ])->refresh();

        $this->assertNotNull($registro->data_execucao);
    }

    public function test_apagar_o_usuario_apaga_o_historico_dele(): void
    {
        $registro = HistoricoTreino::factory()->create();

        $registro->user->delete();

        $this->assertModelMissing($registro);
    }
}
