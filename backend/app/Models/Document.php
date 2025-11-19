<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'documentable_type',
        'documentable_id',
        'type',
        'name',
        'description',
        'file_name',
        'file_path',
        'file_size',
        'mime_type',
        'version',
        'is_signed',
        'signed_at',
        'signed_by',
        'expires_at',
        'uploaded_by',
    ];

    protected function casts(): array
    {
        return [
            'file_size' => 'integer',
            'version' => 'integer',
            'is_signed' => 'boolean',
            'signed_at' => 'datetime',
            'expires_at' => 'date',
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
     * Get the user who uploaded the document.
     */
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    /**
     * Get the user who signed the document.
     */
    public function signer()
    {
        return $this->belongsTo(User::class, 'signed_by');
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
        return $this->expires_at && $this->expires_at->isPast();
    }

    /**
     * Check if the document will expire soon (within 30 days).
     */
    public function isExpiringSoon(): bool
    {
        if (!$this->expires_at) {
            return false;
        }
        return $this->expires_at->isFuture() && $this->expires_at->diffInDays(now()) <= 30;
    }
}
