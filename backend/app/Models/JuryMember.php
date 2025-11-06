<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JuryMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'expertise',
        'role',
        'email',
        'phone',
        'bio'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation avec les notes attribuées
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(Rating::class);
    }

    /**
     * Accessor pour le nom complet
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Scope pour les présidents du jury
     */
    public function scopePresidents($query)
    {
        return $query->where('role', 'president');
    }

    /**
     * Scope pour les membres simples
     */
    public function scopeMembers($query)
    {
        return $query->where('role', 'member')->orWhereNull('role');
    }
}