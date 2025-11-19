<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'mobile',
        'date_of_birth',
        'place_of_birth',
        'nationality',
        'id_card_type',
        'id_card_number',
        'id_card_expiry',
        'profession',
        'employer',
        'monthly_income',
        'previous_address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'notes',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'id_card_expiry' => 'date',
            'monthly_income' => 'decimal:2',
        ];
    }

    /**
     * Get the owner of the tenant.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
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
        return $this->date_of_birth ? $this->date_of_birth->age : null;
    }

    /**
     * Check if tenant is solvent (income >= 3x rent).
     */
    public function isSolvent(float $rent): bool
    {
        return $this->monthly_income >= ($rent * 3);
    }
}
