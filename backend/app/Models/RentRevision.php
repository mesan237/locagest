<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentRevision extends Model
{
    use HasFactory;

    protected $fillable = [
        'lease_id',
        'revision_date',
        'old_rent',
        'new_rent',
        'irl_quarter',
        'irl_year',
        'old_irl_value',
        'new_irl_value',
        'calculation_formula',
        'increase_percentage',
        'notes',
        'applied_by',
    ];

    protected function casts(): array
    {
        return [
            'revision_date' => 'date',
            'old_rent' => 'decimal:2',
            'new_rent' => 'decimal:2',
            'old_irl_value' => 'decimal:2',
            'new_irl_value' => 'decimal:2',
            'increase_percentage' => 'decimal:2',
        ];
    }

    /**
     * Get the lease that owns the rent revision.
     */
    public function lease()
    {
        return $this->belongsTo(Lease::class);
    }

    /**
     * Get the user who applied the revision.
     */
    public function appliedBy()
    {
        return $this->belongsTo(User::class, 'applied_by');
    }
}
