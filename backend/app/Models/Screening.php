<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Screening extends Model
{
    use HasFactory;

    protected $fillable = [
        'documentary_id',
        'title',
        'date',
        'time',
        'room',
        'is_published'
    ];

    protected $casts = [
        'date' => 'date',
        'is_published' => 'boolean'
    ];

    public function documentary()
    {
        return $this->belongsTo(Documentary::class);
    }

    /**
     * Relation avec les notes
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Calculer la moyenne des notes pour cette projection
     */
    public function getAverageRatingAttribute(): ?float
    {
        if ($this->ratings->isEmpty()) {
            return null;
        }

        return $this->ratings->avg('score');
    }

    /**
     * Vérifier si la projection a été notée
     */
    public function getHasRatingsAttribute(): bool
    {
        return $this->ratings->isNotEmpty();
    }

    /**
     * Vérifier si la projection est passée
     */
    public function getIsPastAttribute(): bool
    {
        $screeningDateTime = $this->date . ' ' . $this->time;
        return now() > $screeningDateTime;
    }
}