<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'rent_id',
        'payment_date',
        'amount',
        'payment_method',
        'transaction_id',
        'receipt_number',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'payment_date' => 'date',
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
