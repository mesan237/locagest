<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Intervention\Image\Laravel\Facades\Image;

class PropertyController extends Controller
{
    /**
     * Display a listing of the properties
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $user = $request->user();

        // Only companies (landlords) can manage properties
        if (!$user->is_company) {
            return response()->json([
                'message' => 'Cette fonctionnalité est réservée aux bailleurs.'
            ], 403);
        }

        $query = Property::where('user_id', $user->id)->with(['photos']);

        // Filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('reference', 'like', '%' . $search . '%')
                  ->orWhere('address', 'like', '%' . $search . '%');
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $properties = $query->paginate($perPage);

        return response()->json($properties);
    }

    /**
     * Store a newly created property
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = $request->user();

        // Only companies (landlords) can create properties
        if (!$user->is_company) {
            return response()->json([
                'message' => 'Cette fonctionnalité est réservée aux bailleurs.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in(['apartment', 'house', 'commercial', 'parking', 'land', 'office'])],
            'address' => 'required|string|max:255',
            'address_complement' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'surface_area' => 'required|numeric|min:1',
            'rooms' => 'nullable|integer|min:1',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'floor' => 'nullable|integer',
            'building_year' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'rent_amount' => 'required|numeric|min:0',
            'charges_amount' => 'nullable|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'status' => ['nullable', Rule::in(['available', 'rented', 'maintenance', 'reserved'])],
            'is_furnished' => 'nullable|boolean',
            'has_parking' => 'nullable|boolean',
            'has_elevator' => 'nullable|boolean',
            'has_balcony' => 'nullable|boolean',
            'has_terrace' => 'nullable|boolean',
            'has_garden' => 'nullable|boolean',
            'energy_rating' => ['nullable', Rule::in(['A', 'B', 'C', 'D', 'E', 'F', 'G'])],
            'estimated_value' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Generate unique reference
        $lastProperty = Property::where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = $lastProperty ? (intval(substr($lastProperty->reference, -3)) + 1) : 1;
        $reference = 'REF-' . date('Y') . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        $propertyData = $validator->validated();
        $propertyData['user_id'] = $user->id;
        $propertyData['reference'] = $reference;
        $propertyData['status'] = $propertyData['status'] ?? 'available';

        $property = Property::create($propertyData);

        return response()->json([
            'message' => 'Propriété créée avec succès',
            'property' => $property->load('photos')
        ], 201);
    }

    /**
     * Display the specified property
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $property = Property::with(['photos', 'leases.tenant'])
            ->where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$property) {
            return response()->json([
                'message' => 'Propriété non trouvée'
            ], 404);
        }

        return response()->json($property);
    }

    /**
     * Update the specified property
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $user = $request->user();

        $property = Property::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$property) {
            return response()->json([
                'message' => 'Propriété non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'type' => ['sometimes', Rule::in(['apartment', 'house', 'commercial', 'parking', 'land', 'office'])],
            'address' => 'sometimes|string|max:255',
            'address_complement' => 'nullable|string|max:255',
            'city' => 'sometimes|string|max:100',
            'postal_code' => 'sometimes|string|max:20',
            'country' => 'sometimes|string|max:100',
            'surface_area' => 'sometimes|numeric|min:1',
            'rooms' => 'nullable|integer|min:1',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'floor' => 'nullable|integer',
            'building_year' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'rent_amount' => 'sometimes|numeric|min:0',
            'charges_amount' => 'nullable|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'status' => ['sometimes', Rule::in(['available', 'rented', 'maintenance', 'reserved'])],
            'is_furnished' => 'sometimes|boolean',
            'has_parking' => 'sometimes|boolean',
            'has_elevator' => 'sometimes|boolean',
            'has_balcony' => 'sometimes|boolean',
            'has_terrace' => 'sometimes|boolean',
            'has_garden' => 'sometimes|boolean',
            'energy_rating' => ['nullable', Rule::in(['A', 'B', 'C', 'D', 'E', 'F', 'G'])],
            'estimated_value' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $property->update($validator->validated());

        return response()->json([
            'message' => 'Propriété mise à jour avec succès',
            'property' => $property->load('photos')
        ]);
    }

    /**
     * Remove the specified property (soft delete)
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $property = Property::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$property) {
            return response()->json([
                'message' => 'Propriété non trouvée'
            ], 404);
        }

        // Check if property has active leases
        $hasActiveLeases = $property->leases()->where('status', 'active')->exists();

        if ($hasActiveLeases) {
            return response()->json([
                'message' => 'Impossible de supprimer une propriété avec des baux actifs'
            ], 422);
        }

        $property->delete();

        return response()->json([
            'message' => 'Propriété supprimée avec succès'
        ]);
    }

    /**
     * Upload photos for a property
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadPhotos(Request $request, $id)
    {
        $user = $request->user();

        $property = Property::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$property) {
            return response()->json([
                'message' => 'Propriété non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'photos' => 'required|array|min:1|max:10',
            'photos.*' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120', // 5MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $uploadedPhotos = [];
        $existingPhotosCount = $property->photos()->count();

        foreach ($request->file('photos') as $index => $photo) {
            // Generate unique filename
            $filename = 'property_' . $property->id . '_' . time() . '_' . uniqid() . '.' . $photo->getClientOriginalExtension();

            // Store original image
            $path = $photo->storeAs('properties/' . $property->id, $filename, 'public');

            // Get image dimensions
            $imageResource = Image::read($photo->getRealPath());
            $width = $imageResource->width();
            $height = $imageResource->height();

            // Create photo record
            $propertyPhoto = PropertyPhoto::create([
                'property_id' => $property->id,
                'file_path' => $path,
                'file_name' => $filename,
                'file_size' => $photo->getSize(),
                'mime_type' => $photo->getMimeType(),
                'width' => $width,
                'height' => $height,
                'display_order' => $existingPhotosCount + $index + 1,
                'is_main' => $existingPhotosCount === 0 && $index === 0, // First photo is main if no photos exist
            ]);

            $uploadedPhotos[] = $propertyPhoto;
        }

        return response()->json([
            'message' => count($uploadedPhotos) . ' photo(s) uploadée(s) avec succès',
            'photos' => $uploadedPhotos,
            'property' => $property->load('photos')
        ], 201);
    }

    /**
     * Delete a photo
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $propertyId
     * @param  int  $photoId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deletePhoto(Request $request, $propertyId, $photoId)
    {
        $user = $request->user();

        $property = Property::where('id', $propertyId)
            ->where('user_id', $user->id)
            ->first();

        if (!$property) {
            return response()->json([
                'message' => 'Propriété non trouvée'
            ], 404);
        }

        $photo = PropertyPhoto::where('id', $photoId)
            ->where('property_id', $propertyId)
            ->first();

        if (!$photo) {
            return response()->json([
                'message' => 'Photo non trouvée'
            ], 404);
        }

        // Delete file from storage
        if (Storage::disk('public')->exists($photo->file_path)) {
            Storage::disk('public')->delete($photo->file_path);
        }

        $wasMain = $photo->is_main;
        $photo->delete();

        // If deleted photo was main, set the first remaining photo as main
        if ($wasMain) {
            $firstPhoto = PropertyPhoto::where('property_id', $propertyId)
                ->orderBy('display_order')
                ->first();

            if ($firstPhoto) {
                $firstPhoto->update(['is_main' => true]);
            }
        }

        return response()->json([
            'message' => 'Photo supprimée avec succès',
            'property' => $property->load('photos')
        ]);
    }

    /**
     * Set main photo for a property
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $propertyId
     * @param  int  $photoId
     * @return \Illuminate\Http\JsonResponse
     */
    public function setMainPhoto(Request $request, $propertyId, $photoId)
    {
        $user = $request->user();

        $property = Property::where('id', $propertyId)
            ->where('user_id', $user->id)
            ->first();

        if (!$property) {
            return response()->json([
                'message' => 'Propriété non trouvée'
            ], 404);
        }

        $photo = PropertyPhoto::where('id', $photoId)
            ->where('property_id', $propertyId)
            ->first();

        if (!$photo) {
            return response()->json([
                'message' => 'Photo non trouvée'
            ], 404);
        }

        // Remove is_main from all photos of this property
        PropertyPhoto::where('property_id', $propertyId)
            ->update(['is_main' => false]);

        // Set this photo as main
        $photo->update(['is_main' => true]);

        return response()->json([
            'message' => 'Photo principale définie avec succès',
            'property' => $property->load('photos')
        ]);
    }
}
