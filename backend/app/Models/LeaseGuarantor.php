<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaseGuarantor extends Model
{
    use HasFactory;

    protected $fillable = [
        'lease_id',
        'type',
        'first_name',
        'last_name',
        'company_name',
        'email',
        'phone',
        'address',
        'city',
        'postal_code',
        'date_of_birth',
        'id_card_number',
        'profession',
        'monthly_income',
        'relationship',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'monthly_income' => 'decimal:2',
        ];
    }

    /**
     * Get the lease that owns the guarantor.
     */
    public function lease()
    {
        return $this->belongsTo(Lease::class);
    }

    /**
     * Get the full name of the guarantor.
     */
    public function getFullNameAttribute(): string
    {
        if ($this->type === 'company') {
            return $this->company_name;
        }
        return "{$this->first_name} {$this->last_name}";
    }
}
