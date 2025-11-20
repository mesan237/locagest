<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Tenant;
use App\Models\Lease;
use App\Models\Rent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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

        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Total properties count
        $totalProperties = Property::where('user_id', $userId)->count();

        // Rented properties count
        $rentedProperties = Property::where('user_id', $userId)
            ->whereHas('leases', function ($query) {
                $query->where('status', 'active');
            })
            ->count();

        // Available properties count
        $availableProperties = $totalProperties - $rentedProperties;

        // Total active tenants
        $activeTenants = Tenant::where('user_id', $userId)
            ->where('is_active', true)
            ->count();

        // Monthly revenue (paid rents for current month)
        $monthlyRevenue = Rent::whereHas('lease', function ($query) use ($userId) {
                $query->whereHas('property', function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                });
            })
            ->whereMonth('period_start', $currentMonth)
            ->whereYear('period_start', $currentYear)
            ->where('status', 'paid')
            ->sum('total_amount');

        // Pending payments for current month
        $pendingPayments = Rent::whereHas('lease', function ($query) use ($userId) {
                $query->whereHas('property', function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                });
            })
            ->whereMonth('period_start', $currentMonth)
            ->whereYear('period_start', $currentYear)
            ->whereIn('status', ['pending', 'late'])
            ->sum('total_amount');

        // Occupancy rate
        $occupancyRate = $totalProperties > 0
            ? round(($rentedProperties / $totalProperties) * 100, 2)
            : 0;

        // Recent rents (last 5)
        $recentRents = Rent::with(['lease.property', 'lease.tenant'])
            ->whereHas('lease', function ($query) use ($userId) {
                $query->whereHas('property', function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                });
            })
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($rent) {
                return [
                    'id' => $rent->id,
                    'property_name' => $rent->lease->property->name,
                    'tenant_name' => $rent->lease->tenant->first_name . ' ' . $rent->lease->tenant->last_name,
                    'amount' => $rent->total_amount,
                    'status' => $rent->status,
                    'due_date' => $rent->due_date,
                    'paid_date' => $rent->paid_date,
                ];
            });

        // Upcoming rents (next 30 days)
        $upcomingRents = Rent::with(['lease.property', 'lease.tenant'])
            ->whereHas('lease', function ($query) use ($userId) {
                $query->whereHas('property', function ($q) use ($userId) {
                    $q->where('user_id', $userId);
                });
            })
            ->where('status', 'pending')
            ->whereBetween('due_date', [Carbon::now(), Carbon::now()->addDays(30)])
            ->orderBy('due_date', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($rent) {
                return [
                    'id' => $rent->id,
                    'property_name' => $rent->lease->property->name,
                    'tenant_name' => $rent->lease->tenant->first_name . ' ' . $rent->lease->tenant->last_name,
                    'amount' => $rent->total_amount,
                    'due_date' => $rent->due_date,
                ];
            });

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
