<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Utility extends Model
{
    use HasFactory;

    protected $fillable = [
        'lease_id',
        'type',
        'period_start',
        'period_end',
        'amount',
        'included_in_charges',
        'provider',
        'meter_reading_start',
        'meter_reading_end',
        'consumption',
        'unit_price',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'amount' => 'decimal:2',
            'unit_price' => 'decimal:4',
            'consumption' => 'decimal:2',
            'included_in_charges' => 'boolean',
        ];
    }

    /**
     * Get the lease that owns the utility.
     */
    public function lease()
    {
        return $this->belongsTo(Lease::class);
    }
}
