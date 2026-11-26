<?php

namespace Database\Factories;

use App\Models\Treino;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Treino>
 */
class TreinoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1,
            'nome' => fake()->title(),
            'tempo' => fake()->numberBetween(500, 3000),
            'series' => fake()->numberBetween(1, 4),
            'intervalo' => fake()->numberBetween(10, 30),
            'repeticoes' => fake()->numberBetween(6, 24),
            'video' => fake()->url(),
        ];
    }
}
