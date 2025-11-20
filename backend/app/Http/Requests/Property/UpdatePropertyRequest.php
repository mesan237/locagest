<?php

namespace App\Http\Requests\Property;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePropertyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only companies (landlords) can update properties
        return $this->user() && $this->user()->is_company;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'type' => ['sometimes', Rule::in(['apartment', 'house', 'commercial', 'parking', 'land', 'office'])],
            'address' => 'sometimes|string|max:255',
            'address_complement' => 'nullable|string|max:255',
            'city' => 'sometimes|string|max:100',
            'postal_code' => 'sometimes|string|max:20',
            'country' => 'sometimes|string|max:2',
            'surface_area' => 'sometimes|numeric|min:1',
            'rooms' => 'nullable|integer|min:1',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'floor' => 'nullable|integer',
            'construction_year' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
            'description' => 'nullable|string',
            'features' => 'nullable|array',
            'equipment' => 'nullable|array',
            'status' => ['sometimes', Rule::in(['available', 'rented', 'maintenance', 'reserved'])],
            'is_furnished' => 'sometimes|boolean',
            'has_parking' => 'sometimes|boolean',
            'has_elevator' => 'sometimes|boolean',
            'has_balcony' => 'sometimes|boolean',
            'has_terrace' => 'sometimes|boolean',
            'has_garden' => 'sometimes|boolean',
            'has_garage' => 'sometimes|boolean',
            'has_cellar' => 'sometimes|boolean',
            'energy_rating' => ['nullable', Rule::in(['A', 'B', 'C', 'D', 'E', 'F', 'G'])],
            'ges_rating' => ['nullable', Rule::in(['A', 'B', 'C', 'D', 'E', 'F', 'G'])],
            'energy_consumption' => 'nullable|numeric|min:0',
            'ges_emission' => 'nullable|numeric|min:0',
            'estimated_value' => 'nullable|numeric|min:0',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'cadastral_reference' => 'nullable|string|max:50',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.max' => 'Le nom ne peut pas dépasser 255 caractères',
            'type.in' => 'Le type de bien doit être: appartement, maison, commercial, parking, terrain ou bureau',
            'country.max' => 'Le code pays doit être sur 2 caractères (ex: FR)',
            'surface_area.min' => 'La surface doit être supérieure à 0',
            'construction_year.min' => 'L\'année de construction doit être supérieure à 1800',
            'construction_year.max' => 'L\'année de construction est invalide',
            'status.in' => 'Le statut doit être: disponible, loué, maintenance ou réservé',
            'energy_rating.in' => 'La note énergétique doit être entre A et G',
            'ges_rating.in' => 'La note GES doit être entre A et G',
            'latitude.between' => 'La latitude doit être entre -90 et 90',
            'longitude.between' => 'La longitude doit être entre -180 et 180',
        ];
    }
}
