<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'reference',
        'name',
        'type',
        'address',
        'address_complement',
        'city',
        'postal_code',
        'country',
        'latitude',
        'longitude',
        'cadastral_reference',
        'surface_area',
        'rooms',
        'bedrooms',
        'bathrooms',
        'floor',
        'total_floors',
        'construction_year',
        'energy_rating',
        'ges_rating',
        'has_elevator',
        'has_parking',
        'has_balcony',
        'has_terrace',
        'has_garden',
        'is_furnished',
        'description',
        'equipment',
        'status',
        'acquisition_date',
        'acquisition_price',
        'estimated_value',
    ];

    protected function casts(): array
    {
        return [
            'acquisition_date' => 'date',
            'acquisition_price' => 'decimal:2',
            'estimated_value' => 'decimal:2',
            'surface_area' => 'decimal:2',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'has_parking' => 'boolean',
            'has_elevator' => 'boolean',
            'has_balcony' => 'boolean',
            'has_terrace' => 'boolean',
            'has_garden' => 'boolean',
            'is_furnished' => 'boolean',
            'equipment' => 'array',
        ];
    }

    /**
     * Get the owner of the property.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the photos for the property.
     */
    public function photos()
    {
        return $this->hasMany(PropertyPhoto::class);
    }

    /**
     * Get the main photo for the property.
     */
    public function mainPhoto()
    {
        return $this->hasOne(PropertyPhoto::class)->where('is_main', true);
    }

    /**
     * Get the leases for the property.
     */
    public function leases()
    {
        return $this->hasMany(Lease::class);
    }

    /**
     * Get the active lease for the property.
     */
    public function activeLease()
    {
        return $this->hasOne(Lease::class)->where('status', 'active');
    }

    /**
     * Get the expenses for the property.
     */
    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }

    /**
     * Get the documents for the property.
     */
    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    /**
     * Get the inventories for the property.
     */
    public function inventories()
    {
        return $this->hasMany(PropertyInventory::class);
    }

    /**
     * Check if the property is available.
     */
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    /**
     * Check if the property is rented.
     */
    public function isRented(): bool
    {
        return $this->status === 'rented';
    }
}
