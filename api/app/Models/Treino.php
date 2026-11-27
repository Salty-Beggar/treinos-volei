<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Treino extends Model
{
    /** @use HasFactory<TreinoFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nome',
        'tempo',
        'series',
        'intervalo',
        'repeticoes',
        'video',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    protected $table='treino';
    public $timestamps = false;
}
