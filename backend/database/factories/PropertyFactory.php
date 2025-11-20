<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['apartment', 'house', 'commercial', 'parking', 'office', 'land', 'garage'];
        $type = fake()->randomElement($types);

        return [
            'reference' => 'REF-' . date('Y') . '-' . fake()->unique()->numberBetween(1000, 9999),
            'name' => $this->generatePropertyName($type),
            'type' => $type,
            'address' => fake()->streetAddress(),
            'address_complement' => fake()->optional(0.3)->secondaryAddress(),
            'city' => fake()->city(),
            'postal_code' => fake()->postcode(),
            'country' => 'FR',
            'latitude' => fake()->optional(0.5)->latitude(41, 51),
            'longitude' => fake()->optional(0.5)->longitude(-5, 10),
            'cadastral_reference' => fake()->optional(0.3)->regexify('[A-Z]{2}[0-9]{4}[A-Z]{2}'),
            'surface_area' => $type === 'parking' ? fake()->randomFloat(2, 10, 30) : fake()->randomFloat(2, 20, 200),
            'rooms' => in_array($type, ['apartment', 'house']) ? fake()->numberBetween(1, 6) : null,
            'bedrooms' => in_array($type, ['apartment', 'house']) ? fake()->numberBetween(0, 5) : null,
            'bathrooms' => in_array($type, ['apartment', 'house', 'office']) ? fake()->numberBetween(1, 3) : null,
            'floor' => in_array($type, ['apartment', 'office']) ? fake()->optional(0.7)->numberBetween(0, 10) : null,
            'total_floors' => in_array($type, ['apartment', 'office']) ? fake()->optional(0.5)->numberBetween(1, 15) : null,
            'construction_year' => fake()->optional(0.7)->numberBetween(1950, 2023),
            'energy_rating' => fake()->optional(0.6)->randomElement(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
            'ges_rating' => fake()->optional(0.6)->randomElement(['A', 'B', 'C', 'D', 'E', 'F', 'G']),
            'has_elevator' => in_array($type, ['apartment', 'office']) ? fake()->boolean(40) : false,
            'has_parking' => fake()->boolean(30),
            'has_balcony' => $type === 'apartment' ? fake()->boolean(40) : false,
            'has_terrace' => in_array($type, ['apartment', 'house']) ? fake()->boolean(20) : false,
            'has_garden' => $type === 'house' ? fake()->boolean(60) : false,
            'is_furnished' => in_array($type, ['apartment', 'house']) ? fake()->boolean(30) : false,
            'description' => fake()->optional(0.8)->paragraph(3),
            'equipment' => fake()->optional(0.5)->randomElements(
                ['Wi-Fi', 'Cuisine équipée', 'Lave-vaisselle', 'Lave-linge', 'Climatisation', 'Chauffage central'],
                fake()->numberBetween(1, 4)
            ),
            'status' => fake()->randomElement(['available', 'rented', 'draft']),
            'acquisition_date' => fake()->optional(0.4)->dateTimeBetween('-10 years', '-1 year'),
            'acquisition_price' => fake()->optional(0.4)->randomFloat(2, 50000, 800000),
            'estimated_value' => fake()->optional(0.6)->randomFloat(2, 80000, 1000000),
        ];
    }

    /**
     * Generate a property name based on type.
     */
    private function generatePropertyName(string $type): string
    {
        return match ($type) {
            'apartment' => fake()->randomElement([
                'Appartement T2',
                'Appartement T3',
                'Appartement T4',
                'Studio',
                'Duplex',
            ]) . ' - ' . fake()->city(),
            'house' => fake()->randomElement([
                'Maison',
                'Villa',
                'Pavillon',
            ]) . ' ' . fake()->numberBetween(2, 6) . ' pièces',
            'commercial' => 'Local commercial ' . fake()->numberBetween(20, 200) . 'm²',
            'parking' => 'Place de parking ' . fake()->randomElement(['intérieure', 'extérieure', 'box fermé']),
            'office' => 'Bureau ' . fake()->numberBetween(20, 150) . 'm²',
            'land' => 'Terrain ' . fake()->numberBetween(200, 2000) . 'm²',
            'garage' => 'Garage ' . fake()->randomElement(['simple', 'double', 'triple']),
            default => 'Bien immobilier',
        };
    }
}
