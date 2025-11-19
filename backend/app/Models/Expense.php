<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_id',
        'property_id',
        'category',
        'description',
        'amount',
        'vat_amount',
        'total_amount',
        'vat_rate',
        'expense_date',
        'payment_method',
        'supplier',
        'invoice_number',
        'invoice_path',
        'is_deductible',
        'deductible_percentage',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'expense_date' => 'date',
            'amount' => 'decimal:2',
            'vat_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'vat_rate' => 'decimal:2',
            'deductible_percentage' => 'decimal:2',
            'is_deductible' => 'boolean',
        ];
    }

    /**
     * Get the owner of the expense.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the property associated with the expense.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Calculate the deductible amount.
     */
    public function getDeductibleAmountAttribute(): float
    {
        if (!$this->is_deductible) {
            return 0;
        }
        return $this->total_amount * ($this->deductible_percentage / 100);
    }
}
