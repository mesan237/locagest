<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'name' => $this->name,
            'type' => $this->type,
            'type_label' => $this->getTypeLabel(),
            'status' => $this->status,
            'status_label' => $this->getStatusLabel(),

            // Address
            'address' => $this->address,
            'address_complement' => $this->address_complement,
            'city' => $this->city,
            'postal_code' => $this->postal_code,
            'country' => $this->country,
            'full_address' => $this->getFullAddress(),

            // Specifications
            'surface_area' => $this->surface_area,
            'rooms' => $this->rooms,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'floor' => $this->floor,
            'construction_year' => $this->construction_year,

            // Description
            'description' => $this->description,
            'features' => $this->features,
            'equipment' => $this->equipment,

            // Amenities
            'is_furnished' => (bool) $this->is_furnished,
            'has_parking' => (bool) $this->has_parking,
            'has_elevator' => (bool) $this->has_elevator,
            'has_balcony' => (bool) $this->has_balcony,
            'has_terrace' => (bool) $this->has_terrace,
            'has_garden' => (bool) $this->has_garden,
            'has_garage' => (bool) $this->has_garage,
            'has_cellar' => (bool) $this->has_cellar,

            // Energy
            'energy_rating' => $this->energy_rating,
            'ges_rating' => $this->ges_rating,
            'energy_consumption' => $this->energy_consumption,
            'ges_emission' => $this->ges_emission,

            // Financial
            'estimated_value' => $this->estimated_value,

            // Location
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'cadastral_reference' => $this->cadastral_reference,

            // Relationships
            'photos' => PropertyPhotoResource::collection($this->whenLoaded('photos')),
            'main_photo' => new PropertyPhotoResource($this->whenLoaded('photos', function() {
                return $this->photos->where('is_main', true)->first();
            })),
            'leases_count' => $this->when(isset($this->leases_count), $this->leases_count),
            'active_lease' => $this->when($this->relationLoaded('leases'), function() {
                return $this->leases->where('status', 'active')->first();
            }),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }

    /**
     * Get type label in French
     */
    private function getTypeLabel(): string
    {
        return match($this->type) {
            'apartment' => 'Appartement',
            'house' => 'Maison',
            'commercial' => 'Local commercial',
            'parking' => 'Parking',
            'land' => 'Terrain',
            'office' => 'Bureau',
            default => $this->type,
        };
    }

    /**
     * Get status label in French
     */
    private function getStatusLabel(): string
    {
        return match($this->status) {
            'available' => 'Disponible',
            'rented' => 'Loué',
            'maintenance' => 'En maintenance',
            'reserved' => 'Réservé',
            default => $this->status,
        };
    }

    /**
     * Get full formatted address
     */
    private function getFullAddress(): string
    {
        $parts = array_filter([
            $this->address,
            $this->address_complement,
            $this->postal_code . ' ' . $this->city,
            $this->country,
        ]);

        return implode(', ', $parts);
    }
}
