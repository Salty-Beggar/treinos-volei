<?php

namespace Database\Factories;

use App\Models\HistoricoTreino;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<HistoricoTreino>
 */
class HistoricoTreinoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'nome' => fake()->randomElement([
                'Manchete na parede',
                'Toque e controle de bola',
                'Saque flutuante por zonas',
                'Aproximação e ataque',
                'Deslocamento para bloqueio',
                'Defesa em mergulho',
            ]),
            'duracao_minutos' => fake()->numberBetween(10, 90),
            'data_execucao' => fake()->dateTimeBetween('-30 days'),
        ];
    }
}
