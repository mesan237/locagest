<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin/Test users
        $users = [
            [
                'name' => 'Bailleur Test',
                'email' => 'bailleur@locagest.fr',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'phone' => '+33612345678',
                'address' => '123 Rue de la République',
                'city' => 'Paris',
                'postal_code' => '75001',
                'country' => 'FR',
                'company_name' => 'Immobilier Paris SAS',
                'company_siret' => '12345678901234',
                'is_company' => true,
                'timezone' => 'Europe/Paris',
                'locale' => 'fr',
            ],
            [
                'name' => 'Jean Dupont',
                'email' => 'jean.dupont@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'phone' => '+33687654321',
                'address' => '45 Avenue des Champs',
                'city' => 'Lyon',
                'postal_code' => '69001',
                'country' => 'FR',
                'company_name' => 'Dupont Immobilier',
                'company_siret' => '98765432109876',
                'is_company' => true,
                'timezone' => 'Europe/Paris',
                'locale' => 'fr',
            ],
            [
                'name' => 'Marie Martin',
                'email' => 'marie.martin@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'phone' => '+33698765432',
                'address' => '78 Boulevard Voltaire',
                'city' => 'Marseille',
                'postal_code' => '13001',
                'country' => 'FR',
                'is_company' => false,
                'timezone' => 'Europe/Paris',
                'locale' => 'fr',
            ],
        ];

        foreach ($users as $userData) {
            User::create($userData);
        }

        // Create additional random landlords
        User::factory(5)->landlord()->create();

        // Create additional random tenants
        User::factory(10)->tenant()->create();
    }
}
