<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'first_name', 'last_name', 'birth_date'
    ];

    protected $table = 'producteurs';
}