<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_inventory_id',
        'room',
        'item',
        'quantity',
        'condition',
        'description',
        'photo_path',
        'needs_repair',
        'repair_cost',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'needs_repair' => 'boolean',
            'repair_cost' => 'decimal:2',
        ];
    }

    /**
     * Get the inventory that owns the item.
     */
    public function inventory()
    {
        return $this->belongsTo(PropertyInventory::class, 'property_inventory_id');
    }
}
