<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class TenantController extends Controller
{
    /**
     * Display a listing of tenants
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Only companies (landlords) can manage tenants
        if (!$user->is_company) {
            return response()->json([
                'message' => 'Cette fonctionnalité est réservée aux bailleurs.'
            ], 403);
        }

        $query = Tenant::where('user_id', $user->id);

        // Filters
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', '%' . $search . '%')
                  ->orWhere('last_name', 'like', '%' . $search . '%')
                  ->orWhere('email', 'like', '%' . $search . '%')
                  ->orWhere('phone', 'like', '%' . $search . '%');
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $tenants = $query->paginate($perPage);

        return response()->json($tenants);
    }

    /**
     * Store a newly created tenant
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Only companies (landlords) can create tenants
        if (!$user->is_company) {
            return response()->json([
                'message' => 'Cette fonctionnalité est réservée aux bailleurs.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255|unique:tenants,email',
            'phone' => 'required|string|max:20',
            'phone_secondary' => 'nullable|string|max:20',
            'birth_date' => 'required|date|before:today',
            'birth_place' => 'nullable|string|max:100',
            'nationality' => 'required|string|max:2',
            'id_card_number' => 'nullable|string|max:50',
            'id_card_type' => ['nullable', Rule::in(['id_card', 'passport', 'residence_permit'])],
            'id_card_expiry_date' => 'nullable|date|after:today',
            'profession' => 'nullable|string|max:100',
            'employer' => 'nullable|string|max:255',
            'monthly_income' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $tenantData = $validator->validated();
        $tenantData['user_id'] = $user->id;
        $tenantData['is_active'] = $tenantData['is_active'] ?? true;

        $tenant = Tenant::create($tenantData);

        return response()->json([
            'message' => 'Locataire créé avec succès',
            'tenant' => $tenant
        ], 201);
    }

    /**
     * Display the specified tenant
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $tenant = Tenant::with(['leases.property'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$tenant) {
            return response()->json([
                'message' => 'Locataire non trouvé'
            ], 404);
        }

        return response()->json($tenant);
    }

    /**
     * Update the specified tenant
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $tenant = Tenant::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$tenant) {
            return response()->json([
                'message' => 'Locataire non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|max:255|unique:tenants,email,' . $id,
            'phone' => 'sometimes|string|max:20',
            'phone_secondary' => 'nullable|string|max:20',
            'birth_date' => 'sometimes|date|before:today',
            'birth_place' => 'nullable|string|max:100',
            'nationality' => 'sometimes|string|max:2',
            'id_card_number' => 'nullable|string|max:50',
            'id_card_type' => ['nullable', Rule::in(['id_card', 'passport', 'residence_permit'])],
            'id_card_expiry_date' => 'nullable|date|after:today',
            'profession' => 'nullable|string|max:100',
            'employer' => 'nullable|string|max:255',
            'monthly_income' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $tenant->update($validator->validated());

        return response()->json([
            'message' => 'Locataire mis à jour avec succès',
            'tenant' => $tenant
        ]);
    }

    /**
     * Remove the specified tenant (soft delete)
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $tenant = Tenant::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$tenant) {
            return response()->json([
                'message' => 'Locataire non trouvé'
            ], 404);
        }

        // Check if tenant has active leases
        $hasActiveLeases = $tenant->leases()->where('status', 'active')->exists();

        if ($hasActiveLeases) {
            return response()->json([
                'message' => 'Impossible de supprimer un locataire avec des baux actifs'
            ], 422);
        }

        $tenant->delete();

        return response()->json([
            'message' => 'Locataire supprimé avec succès'
        ]);
    }
}
