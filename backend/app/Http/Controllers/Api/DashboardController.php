<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Tenant;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats(Request $request)
    {
        $userId = $request->user()->id;
        $isCompany = $request->user()->is_company;

        // Only companies (landlords) can access dashboard stats
        if (!$isCompany) {
            return response()->json([
                'message' => 'Cette fonctionnalité est réservée aux bailleurs.'
            ], 403);
        }

        // Total properties count
        $totalProperties = Property::where('user_id', $userId)->count();

        // Rented properties count (based on property status for now, since we don't have leases yet)
        $rentedProperties = Property::where('user_id', $userId)
            ->where('status', 'rented')
            ->count();

        // Available properties count
        $availableProperties = Property::where('user_id', $userId)
            ->where('status', 'available')
            ->count();

        // Total active tenants
        $activeTenants = Tenant::where('user_id', $userId)
            ->where('is_active', true)
            ->count();

        // Monthly revenue (0 for now since we don't have rents data yet)
        $monthlyRevenue = 0;

        // Pending payments (0 for now since we don't have rents data yet)
        $pendingPayments = 0;

        // Occupancy rate
        $occupancyRate = $totalProperties > 0
            ? round(($rentedProperties / $totalProperties) * 100, 2)
            : 0;

        // Recent rents (empty for now since we don't have rents data yet)
        $recentRents = [];

        // Upcoming rents (empty for now since we don't have rents data yet)
        $upcomingRents = [];

        return response()->json([
            'stats' => [
                'total_properties' => $totalProperties,
                'rented_properties' => $rentedProperties,
                'available_properties' => $availableProperties,
                'total_tenants' => $activeTenants,
                'monthly_revenue' => $monthlyRevenue,
                'pending_payments' => $pendingPayments,
                'occupancy_rate' => $occupancyRate,
            ],
            'recent_rents' => $recentRents,
            'upcoming_rents' => $upcomingRents,
        ]);
    }
}
