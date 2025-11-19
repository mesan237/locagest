<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'documentable_type',
        'documentable_id',
        'type',
        'category',
        'name',
        'file_path',
        'file_name',
        'file_size',
        'mime_type',
        'version',
        'is_signed',
        'signed_date',
        'expiry_date',
        'is_archived',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'version' => 'integer',
            'is_signed' => 'boolean',
            'signed_date' => 'date',
            'expiry_date' => 'date',
            'is_archived' => 'boolean',
        ];
    }

    /**
     * Get the parent documentable model (property, tenant, lease, etc.).
     */
    public function documentable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user who owns the document.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the full URL of the document.
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }

    /**
     * Check if the document is expired.
     */
    public function isExpired(): bool
    {
        return $this->expiry_date && $this->expiry_date->isPast();
    }

    /**
     * Check if the document will expire soon (within 30 days).
     */
    public function isExpiringSoon(): bool
    {
        if (!$this->expiry_date) {
            return false;
        }
        return $this->expiry_date->isFuture() && $this->expiry_date->diffInDays(now()) <= 30;
    }
}
