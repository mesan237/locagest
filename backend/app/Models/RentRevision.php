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
        'indexation_reference',
        'base_index',
        'new_index',
        'increase_percentage',
        'calculation_formula',
        'applied_from',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'revision_date' => 'date',
            'applied_from' => 'date',
            'old_rent' => 'decimal:2',
            'new_rent' => 'decimal:2',
            'base_index' => 'decimal:4',
            'new_index' => 'decimal:4',
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

}
