<?php

namespace Database\Seeders;

use App\Models\Treino;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TreinoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Treino::factory()->count(20)->create();
    }
}
