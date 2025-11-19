<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price_monthly',
        'price_yearly',
        'max_properties',
        'max_tenants',
        'max_documents',
        'features',
        'is_active',
        'trial_days',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price_monthly' => 'decimal:2',
            'price_yearly' => 'decimal:2',
            'max_properties' => 'integer',
            'max_tenants' => 'integer',
            'max_documents' => 'integer',
            'trial_days' => 'integer',
            'sort_order' => 'integer',
            'features' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the subscriptions for the plan.
     */
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get the active subscriptions for the plan.
     */
    public function activeSubscriptions()
    {
        return $this->hasMany(Subscription::class)->where('status', 'active');
    }

    /**
     * Scope to get active plans.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get yearly savings percentage.
     */
    public function getYearlySavingsAttribute(): float
    {
        if (!$this->price_monthly || !$this->price_yearly) {
            return 0;
        }
        $monthlyYearly = $this->price_monthly * 12;
        return (($monthlyYearly - $this->price_yearly) / $monthlyYearly) * 100;
    }
}
