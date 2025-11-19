<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rent extends Model
{
    use HasFactory;

    protected $fillable = [
        'lease_id',
        'period_start',
        'period_end',
        'due_date',
        'amount',
        'charges',
        'total_amount',
        'paid_amount',
        'balance',
        'status',
        'payment_method',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'due_date' => 'date',
            'amount' => 'decimal:2',
            'charges' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'paid_amount' => 'decimal:2',
            'balance' => 'decimal:2',
        ];
    }

    /**
     * Get the lease that owns the rent.
     */
    public function lease()
    {
        return $this->belongsTo(Lease::class);
    }

    /**
     * Get the payments for the rent.
     */
    public function payments()
    {
        return $this->hasMany(RentPayment::class);
    }

    /**
     * Check if the rent is fully paid.
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid' && $this->balance <= 0;
    }

    /**
     * Check if the rent is late.
     */
    public function isLate(): bool
    {
        return $this->status === 'late' || ($this->status === 'pending' && $this->due_date->isPast());
    }

    /**
     * Check if the rent is partially paid.
     */
    public function isPartiallyPaid(): bool
    {
        return $this->status === 'partial';
    }

    /**
     * Get the days late.
     */
    public function getDaysLateAttribute(): int
    {
        if ($this->isPaid()) {
            return 0;
        }
        return max(0, now()->diffInDays($this->due_date, false));
    }
}
