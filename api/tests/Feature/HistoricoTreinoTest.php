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

    public function test_registra_um_treino_concluido(): void
    {
        $usuario = User::factory()->create();

        $this->postJson('/api/historico', [
            'user_id' => $usuario->id,
            'nome' => 'Aproximação e ataque',
            'duracao_minutos' => 40,
        ])
            ->assertCreated()
            ->assertJsonPath('data.nome', 'Aproximação e ataque')
            ->assertJsonPath('mensagem', 'Treino registrado no histórico!');

        $registro = HistoricoTreino::sole();
        $this->assertSame($usuario->id, $registro->user_id);
        $this->assertNotNull($registro->data_execucao);
    }

    public function test_registrar_exige_os_campos_e_um_usuario_existente(): void
    {
        $this->postJson('/api/historico', ['user_id' => 999, 'duracao_minutos' => 0])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['user_id', 'nome', 'duracao_minutos']);

        $this->assertDatabaseCount('historico_treino', 0);
    }

    public function test_mostra_um_registro(): void
    {
        $registro = HistoricoTreino::factory()->create(['nome' => 'Defesa em mergulho']);

        $this->getJson("/api/historico/{$registro->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $registro->id)
            ->assertJsonPath('data.nome', 'Defesa em mergulho');
    }

    public function test_registro_inexistente_retorna_404(): void
    {
        $this->getJson('/api/historico/999')
            ->assertNotFound()
            ->assertJsonPath('message', 'Registro do histórico não encontrado.');
    }

    public function test_edita_um_registro_sem_trocar_o_dono(): void
    {
        $registro = HistoricoTreino::factory()->create(['duracao_minutos' => 20]);
        $outroUsuario = User::factory()->create();

        $this->putJson("/api/historico/{$registro->id}", [
            'duracao_minutos' => 35,
            'user_id' => $outroUsuario->id,
        ])
            ->assertOk()
            ->assertJsonPath('data.duracao_minutos', 35);

        $registro->refresh();
        $this->assertSame(35, $registro->duracao_minutos);
        $this->assertNotSame($outroUsuario->id, $registro->user_id);
    }

    public function test_apaga_um_registro(): void
    {
        $registro = HistoricoTreino::factory()->create();

        $this->deleteJson("/api/historico/{$registro->id}")
            ->assertOk()
            ->assertJsonPath('mensagem', 'Registro removido do histórico!');

        $this->assertModelMissing($registro);
    }
}
