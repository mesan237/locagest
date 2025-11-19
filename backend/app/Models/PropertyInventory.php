<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyInventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'lease_id',
        'type',
        'date',
        'conducted_by',
        'tenant_present',
        'tenant_signature',
        'owner_signature',
        'general_condition',
        'meter_readings',
        'keys_count',
        'notes',
        'pdf_path',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'datetime',
            'tenant_present' => 'boolean',
            'meter_readings' => 'array',
        ];
    }

    /**
     * Get the property that owns the inventory.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the lease associated with the inventory.
     */
    public function lease()
    {
        return $this->belongsTo(Lease::class);
    }

    /**
     * Get the items for the inventory.
     */
    public function items()
    {
        return $this->hasMany(InventoryItem::class);
    }

    /**
     * Get the conductor of the inventory.
     */
    public function conductor()
    {
        return $this->belongsTo(User::class, 'conducted_by');
    }
}
