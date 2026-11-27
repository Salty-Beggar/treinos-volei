<?php

namespace App\Models;

use Database\Factories\HistoricoTreinoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoricoTreino extends Model
{
    /** @use HasFactory<HistoricoTreinoFactory> */
    use HasFactory;

    protected $table = 'historico_treino';

    // A tabela não tem created_at/updated_at; a data fica em data_execucao.
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'nome',
        'duracao_minutos',
        'data_execucao',
    ];

    protected function casts(): array
    {
        return [
            'duracao_minutos' => 'integer',
            'data_execucao' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
