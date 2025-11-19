<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->user()->id;

        return [
            'name' => 'sometimes|string|max:255',
            'email' => "sometimes|email|max:255|unique:users,email,{$userId}",
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'company_siret' => 'nullable|string|max:14|regex:/^[0-9]{14}$/',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'country' => 'nullable|string|size:2|uppercase',
            'locale' => 'nullable|string|in:fr,en',
            'timezone' => 'nullable|string|max:50',
            'is_company' => 'boolean',
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
            'email.email' => 'L\'email doit être une adresse email valide.',
            'email.unique' => 'Cet email est déjà utilisé.',
            'company_siret.regex' => 'Le SIRET doit contenir exactement 14 chiffres.',
            'country.size' => 'Le code pays doit contenir exactement 2 caractères.',
            'locale.in' => 'La langue doit être "fr" ou "en".',
        ];
    }
}
