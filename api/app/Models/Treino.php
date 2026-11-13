<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Treino extends Model
{
    /** @use HasFactory<TreinoFactory> */
    use HasFactory;

    protected $fillable = [
        'nome',
        'tempo',
        'series',
        'intervalo',
        'repeticoes',
        'video',
    ];
    
}
