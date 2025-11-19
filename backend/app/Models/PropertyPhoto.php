<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'property_id',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'width',
        'height',
        'is_main',
        'display_order',
        'caption',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'width' => 'integer',
            'height' => 'integer',
            'is_main' => 'boolean',
            'display_order' => 'integer',
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
