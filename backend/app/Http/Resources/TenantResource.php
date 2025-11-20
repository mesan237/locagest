<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TenantResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->first_name . ' ' . $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'phone_secondary' => $this->phone_secondary,

            // Personal Information
            'birth_date' => $this->birth_date,
            'birth_place' => $this->birth_place,
            'age' => $this->birth_date ? \Carbon\Carbon::parse($this->birth_date)->age : null,
            'nationality' => $this->nationality,

            // ID Card
            'id_card_number' => $this->id_card_number,
            'id_card_type' => $this->id_card_type,
            'id_card_type_label' => $this->getIdCardTypeLabel(),
            'id_card_expiry_date' => $this->id_card_expiry_date,
            'id_card_front_path' => $this->id_card_front_path,
            'id_card_back_path' => $this->id_card_back_path,

            // Professional Information
            'profession' => $this->profession,
            'employer' => $this->employer,
            'monthly_income' => $this->monthly_income,

            // Status
            'is_active' => (bool) $this->is_active,
            'notes' => $this->notes,

            // Relationships
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
     * Get ID card type label in French
     */
    private function getIdCardTypeLabel(): ?string
    {
        if (!$this->id_card_type) {
            return null;
        }

        return match($this->id_card_type) {
            'id_card' => 'Carte d\'identité',
            'passport' => 'Passeport',
            'residence_permit' => 'Titre de séjour',
            default => $this->id_card_type,
        };
    }
}
