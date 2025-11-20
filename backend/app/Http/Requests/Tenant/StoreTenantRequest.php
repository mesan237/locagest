<?php

namespace App\Http\Requests\Tenant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTenantRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only companies (landlords) can create tenants
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
            'id_card_front_path' => 'nullable|string|max:255',
            'id_card_back_path' => 'nullable|string|max:255',
            'profession' => 'nullable|string|max:100',
            'employer' => 'nullable|string|max:255',
            'monthly_income' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'is_active' => 'nullable|boolean',
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
            'first_name.required' => 'Le prénom est obligatoire',
            'first_name.max' => 'Le prénom ne peut pas dépasser 100 caractères',
            'last_name.required' => 'Le nom est obligatoire',
            'last_name.max' => 'Le nom ne peut pas dépasser 100 caractères',
            'email.required' => 'L\'email est obligatoire',
            'email.email' => 'L\'email doit être valide',
            'email.unique' => 'Cet email est déjà utilisé',
            'phone.required' => 'Le téléphone est obligatoire',
            'birth_date.required' => 'La date de naissance est obligatoire',
            'birth_date.date' => 'La date de naissance doit être une date valide',
            'birth_date.before' => 'La date de naissance doit être dans le passé',
            'nationality.required' => 'La nationalité est obligatoire',
            'nationality.max' => 'Le code nationalité doit être sur 2 caractères (ex: FR)',
            'id_card_type.in' => 'Le type de pièce d\'identité doit être: carte d\'identité, passeport ou titre de séjour',
            'id_card_expiry_date.after' => 'La date d\'expiration doit être dans le futur',
            'monthly_income.numeric' => 'Le revenu mensuel doit être un nombre',
            'monthly_income.min' => 'Le revenu mensuel doit être positif',
        ];
    }
}
