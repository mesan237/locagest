<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RentPayment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'rent_id',
        'amount',
        'payment_date',
        'payment_method',
        'transaction_reference',
        'bank_name',
        'receipt_number',
        'receipt_generated_at',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'payment_date' => 'date',
            'receipt_generated_at' => 'datetime',
            'amount' => 'decimal:2',
        ];
    }

    /**
     * Get the rent that owns the payment.
     */
    public function rent()
    {
        return $this->belongsTo(Rent::class);
    }

    /**
     * Get the user who created the payment.
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
