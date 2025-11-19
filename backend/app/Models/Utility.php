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
        'previous_meter_reading',
        'current_meter_reading',
        'consumption',
        'unit_price',
        'amount',
        'invoice_reference',
        'invoice_date',
        'paid_by_tenant',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'invoice_date' => 'date',
            'previous_meter_reading' => 'decimal:2',
            'current_meter_reading' => 'decimal:2',
            'consumption' => 'decimal:2',
            'unit_price' => 'decimal:4',
            'amount' => 'decimal:2',
            'paid_by_tenant' => 'boolean',
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
