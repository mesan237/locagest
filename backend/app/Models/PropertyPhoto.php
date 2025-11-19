<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'is_main',
        'order',
        'caption',
    ];

    protected function casts(): array
    {
        return [
            'is_main' => 'boolean',
            'file_size' => 'integer',
            'order' => 'integer',
        ];
    }

    /**
     * Get the property that owns the photo.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the full URL of the photo.
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }
}
