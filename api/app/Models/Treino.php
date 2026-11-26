<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Treino extends Model
{
    protected $fillable = [
        'nome',
        'tempo',
        'series',
        'intervalo',
        'repeticoes',
        'video',
    ];
    
    protected $table='treino';
    public $timestamps = false;
}
