<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaseCotenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'lease_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'date_of_birth',
        'id_card_number',
        'profession',
        'monthly_income',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'monthly_income' => 'decimal:2',
        ];
    }

    /**
     * Get the lease that owns the cotenant.
     */
    public function lease()
    {
        return $this->belongsTo(Lease::class);
    }

    /**
     * Get the full name of the cotenant.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
