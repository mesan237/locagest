<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'property_id',
        'category',
        'subcategory',
        'amount',
        'vat_amount',
        'total_amount',
        'description',
        'expense_date',
        'payment_date',
        'payment_method',
        'supplier_name',
        'invoice_number',
        'invoice_path',
        'receipt_path',
        'is_deductible',
        'is_recoverable',
        'recovered_amount',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'expense_date' => 'date',
            'payment_date' => 'date',
            'amount' => 'decimal:2',
            'vat_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'recovered_amount' => 'decimal:2',
            'is_deductible' => 'boolean',
            'is_recoverable' => 'boolean',
        ];
    }

    /**
     * Get the owner of the expense.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the property associated with the expense.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the remaining recoverable amount.
     */
    public function getRemainingRecoverableAttribute(): float
    {
        if (!$this->is_recoverable) {
            return 0;
        }
        return max(0, $this->total_amount - $this->recovered_amount);
    }
}
