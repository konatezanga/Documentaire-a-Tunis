<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documentary extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'title', 'date', 'subject', 'realisateur_id', 'producteur_id'
    ];

    public function realisateur()
    {
        return $this->belongsTo(Realisateur::class);
    }

    public function producteur()
    {
        return $this->belongsTo(Producteur::class);
    }

    public function screenings()
    {
        return $this->hasMany(Screening::class);
    }
}
