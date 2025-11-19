<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_id',
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
        'acquisition_date',
        'acquisition_price',
        'current_value',
        'tax_value',
        'dpe_rating',
        'ges_rating',
        'dpe_value',
        'ges_value',
        'heating_type',
        'has_parking',
        'has_elevator',
        'has_balcony',
        'has_terrace',
        'has_garden',
        'has_cellar',
        'equipment',
        'description',
        'status',
        'availability_date',
    ];

    protected function casts(): array
    {
        return [
            'acquisition_date' => 'date',
            'availability_date' => 'date',
            'acquisition_price' => 'decimal:2',
            'current_value' => 'decimal:2',
            'tax_value' => 'decimal:2',
            'surface_area' => 'decimal:2',
            'dpe_value' => 'integer',
            'ges_value' => 'integer',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'has_parking' => 'boolean',
            'has_elevator' => 'boolean',
            'has_balcony' => 'boolean',
            'has_terrace' => 'boolean',
            'has_garden' => 'boolean',
            'has_cellar' => 'boolean',
            'equipment' => 'array',
        ];
    }

    /**
     * Get the owner of the property.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
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
