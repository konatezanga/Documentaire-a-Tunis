<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'screening_id',
        'jury_member_id',
        'score',
        'comment'
    ];

    protected $casts = [
        'score' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation avec la projection
     */
    public function screening()
    {
        return $this->belongsTo(Screening::class);
    }

    /**
     * Relation avec le membre du jury
     */
    public function juryMember()
    {
        return $this->belongsTo(JuryMember::class);
    }

    /**
     * Validation de la note (0-100)
     */
    public static function validateScore($score): bool
    {
        return is_numeric($score) && $score >= 0 && $score <= 100;
    }

    /**
     * Scope pour les notes d'une projection spécifique
     */
    public function scopeForScreening($query, $screeningId)
    {
        return $query->where('screening_id', $screeningId);
    }

    /**
     * Scope pour les notes d'un membre spécifique
     */
    public function scopeByJuryMember($query, $juryMemberId)
    {
        return $query->where('jury_member_id', $juryMemberId);
    }
}