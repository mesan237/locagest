<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lease extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'property_id',
        'tenant_id',
        'reference',
        'type',
        'start_date',
        'end_date',
        'initial_rent',
        'current_rent',
        'charges',
        'deposit',
        'payment_day',
        'payment_method',
        'indexation_type',
        'irl_base_quarter',
        'irl_base_year',
        'irl_base_value',
        'last_revision_date',
        'notice_period_tenant',
        'notice_period_owner',
        'renewable',
        'auto_renew',
        'special_clauses',
        'status',
        'signed_at',
        'terminated_at',
        'termination_reason',
        'termination_notice_date',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'signed_at' => 'datetime',
            'terminated_at' => 'datetime',
            'termination_notice_date' => 'date',
            'last_revision_date' => 'date',
            'initial_rent' => 'decimal:2',
            'current_rent' => 'decimal:2',
            'charges' => 'decimal:2',
            'deposit' => 'decimal:2',
            'irl_base_value' => 'decimal:2',
            'payment_day' => 'integer',
            'notice_period_tenant' => 'integer',
            'notice_period_owner' => 'integer',
            'renewable' => 'boolean',
            'auto_renew' => 'boolean',
        ];
    }

    /**
     * Get the property for the lease.
     */
    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the tenant for the lease.
     */
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Get the cotenants for the lease.
     */
    public function cotenants()
    {
        return $this->hasMany(LeaseCotenant::class);
    }

    /**
     * Get the guarantors for the lease.
     */
    public function guarantors()
    {
        return $this->hasMany(LeaseGuarantor::class);
    }

    /**
     * Get the rents for the lease.
     */
    public function rents()
    {
        return $this->hasMany(Rent::class);
    }

    /**
     * Get the rent revisions for the lease.
     */
    public function rentRevisions()
    {
        return $this->hasMany(RentRevision::class);
    }

    /**
     * Get the utilities for the lease.
     */
    public function utilities()
    {
        return $this->hasMany(Utility::class);
    }

    /**
     * Get the documents for the lease.
     */
    public function documents()
    {
        return $this->morphMany(Document::class, 'documentable');
    }

    /**
     * Get the inventories for the lease.
     */
    public function inventories()
    {
        return $this->hasMany(PropertyInventory::class);
    }

    /**
     * Check if the lease is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the lease is terminated.
     */
    public function isTerminated(): bool
    {
        return $this->status === 'terminated';
    }

    /**
     * Get total monthly cost (rent + charges).
     */
    public function getTotalMonthlyCostAttribute(): float
    {
        return $this->current_rent + $this->charges;
    }
}
