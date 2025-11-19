<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'phone_secondary',
        'birth_date',
        'birth_place',
        'nationality',
        'id_card_type',
        'id_card_number',
        'id_card_expiry_date',
        'profession',
        'employer',
        'monthly_income',
        'emergency_contact_name',
        'emergency_contact_phone',
        'notes',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
            'id_card_expiry_date' => 'date',
            'monthly_income' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the owner of the tenant.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the leases for the tenant.
     */
    public function leases()
    {
        return $this->hasMany(Lease::class);
    }

    /**
     * Get the active lease for the tenant.
     */
    public function activeLease()
    {
        return $this->hasOne(Lease::class)->where('status', 'active');
    }

    /**
     * Get the documents for the tenant.
     */
    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    /**
     * Get the full name of the tenant.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Calculate the age of the tenant.
     */
    public function getAgeAttribute(): ?int
    {
        return $this->birth_date ? $this->birth_date->age : null;
    }

    /**
     * Check if tenant is solvent (income >= 3x rent).
     */
    public function isSolvent(float $rent): bool
    {
        return $this->monthly_income >= ($rent * 3);
    }
}
