<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('historico_treino', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users', indexName: 'fk_historico_usuario')
                ->cascadeOnDelete();
            $table->string('nome', 100);
            $table->integer('duracao_minutos');
            $table->timestamp('data_execucao')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historico_treino');
    }
};
