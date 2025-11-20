<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first landlord (Bailleur Test)
        $landlord = User::where('email', 'bailleur@locagest.fr')->first();

        if (!$landlord) {
            $this->command->warn('No landlord found. Run UserSeeder first.');
            return;
        }

        $properties = [
            [
                'user_id' => $landlord->id,
                'reference' => 'REF-2024-001',
                'name' => 'Appartement T3 - Centre Ville',
                'type' => 'apartment',
                'address' => '15 Rue de Rivoli',
                'address_complement' => 'Bâtiment A, 3ème étage',
                'city' => 'Paris',
                'postal_code' => '75001',
                'country' => 'France',
                'surface_area' => 65.5,
                'rooms' => 3,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'floor' => 3,
                'building_year' => 1980,
                'description' => 'Bel appartement T3 en plein centre-ville, proche de toutes commodités.',
                'rent_amount' => 1200.00,
                'charges_amount' => 150.00,
                'deposit_amount' => 2400.00,
                'status' => 'rented',
                'is_furnished' => false,
                'has_parking' => false,
                'has_elevator' => true,
                'has_balcony' => true,
                'energy_rating' => 'D',
                'estimated_value' => 350000.00,
            ],
            [
                'user_id' => $landlord->id,
                'reference' => 'REF-2024-002',
                'name' => 'Studio Meublé - Quartier Latin',
                'type' => 'apartment',
                'address' => '28 Boulevard Saint-Michel',
                'city' => 'Paris',
                'postal_code' => '75005',
                'country' => 'France',
                'surface_area' => 25.0,
                'rooms' => 1,
                'bedrooms' => 0,
                'bathrooms' => 1,
                'floor' => 2,
                'building_year' => 2005,
                'description' => 'Studio meublé tout équipé, idéal étudiant.',
                'rent_amount' => 800.00,
                'charges_amount' => 80.00,
                'deposit_amount' => 1600.00,
                'status' => 'available',
                'is_furnished' => true,
                'has_parking' => false,
                'has_elevator' => true,
                'has_balcony' => false,
                'energy_rating' => 'C',
                'estimated_value' => 220000.00,
            ],
            [
                'user_id' => $landlord->id,
                'reference' => 'REF-2024-003',
                'name' => 'Maison 4 pièces avec jardin',
                'type' => 'house',
                'address' => '42 Rue des Lilas',
                'city' => 'Lyon',
                'postal_code' => '69003',
                'country' => 'France',
                'surface_area' => 120.0,
                'rooms' => 4,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'building_year' => 1995,
                'description' => 'Belle maison avec jardin, garage et cave.',
                'rent_amount' => 1500.00,
                'charges_amount' => 100.00,
                'deposit_amount' => 3000.00,
                'status' => 'rented',
                'is_furnished' => false,
                'has_parking' => true,
                'has_elevator' => false,
                'has_balcony' => false,
                'has_garden' => true,
                'energy_rating' => 'E',
                'estimated_value' => 420000.00,
            ],
        ];

        foreach ($properties as $propertyData) {
            Property::create($propertyData);
        }

        // Create additional properties for other landlords
        $otherLandlords = User::where('is_company', true)
            ->where('id', '!=', $landlord->id)
            ->limit(3)
            ->get();

        foreach ($otherLandlords as $otherLandlord) {
            Property::factory(rand(2, 5))->create([
                'user_id' => $otherLandlord->id,
            ]);
        }
    }
}
