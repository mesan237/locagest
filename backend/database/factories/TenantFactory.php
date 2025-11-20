<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tenant>
 */
class TenantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->optional(0.8)->safeEmail(),
            'phone' => fake()->optional(0.9)->phoneNumber(),
            'phone_secondary' => fake()->optional(0.3)->phoneNumber(),
            'birth_date' => fake()->optional(0.7)->dateTimeBetween('-65 years', '-18 years'),
            'birth_place' => fake()->optional(0.6)->city(),
            'nationality' => fake()->optional(0.7)->randomElement(['Française', 'Belge', 'Suisse', 'Italienne', 'Espagnole', 'Allemande']),
            'id_card_type' => fake()->optional(0.6)->randomElement(['national_id', 'passport', 'residence_permit']),
            'id_card_number' => fake()->optional(0.6)->numerify('##########'),
            'id_card_expiry_date' => fake()->optional(0.6)->dateTimeBetween('now', '+10 years'),
            'profession' => fake()->optional(0.7)->jobTitle(),
            'employer' => fake()->optional(0.6)->company(),
            'monthly_income' => fake()->optional(0.7)->randomFloat(2, 1200, 8000),
            'emergency_contact_name' => fake()->optional(0.5)->name(),
            'emergency_contact_phone' => fake()->optional(0.5)->phoneNumber(),
            'notes' => fake()->optional(0.2)->sentence(),
            'is_active' => fake()->boolean(90),
        ];
    }
}
