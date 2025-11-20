<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first landlord
        $landlord = User::where('email', 'bailleur@locagest.fr')->first();

        if (!$landlord) {
            $this->command->warn('No landlord found. Run UserSeeder first.');
            return;
        }

        $tenants = [
            [
                'user_id' => $landlord->id,
                'first_name' => 'Sophie',
                'last_name' => 'Laurent',
                'email' => 'sophie.laurent@email.com',
                'phone' => '+33656789012',
                'phone_secondary' => '+33143567890',
                'birth_date' => '1990-05-15',
                'birth_place' => 'Paris',
                'nationality' => 'Française',
                'id_card_number' => '123456789012',
                'id_card_expiry_date' => '2028-05-15',
                'profession' => 'Ingénieure',
                'employer' => 'Tech Company SAS',
                'monthly_income' => 3500.00,
                'is_active' => true,
            ],
            [
                'user_id' => $landlord->id,
                'first_name' => 'Thomas',
                'last_name' => 'Dubois',
                'email' => 'thomas.dubois@email.com',
                'phone' => '+33678901234',
                'birth_date' => '1985-08-22',
                'birth_place' => 'Lyon',
                'nationality' => 'Française',
                'id_card_number' => '987654321098',
                'id_card_expiry_date' => '2027-08-22',
                'profession' => 'Professeur',
                'employer' => 'Lycée Victor Hugo',
                'monthly_income' => 2800.00,
                'is_active' => true,
            ],
            [
                'user_id' => $landlord->id,
                'first_name' => 'Emma',
                'last_name' => 'Petit',
                'email' => 'emma.petit@email.com',
                'phone' => '+33689012345',
                'birth_date' => '1995-03-10',
                'birth_place' => 'Marseille',
                'nationality' => 'Française',
                'id_card_number' => '456789012345',
                'id_card_expiry_date' => '2029-03-10',
                'profession' => 'Étudiante',
                'employer' => 'Université Paris-Sorbonne',
                'monthly_income' => 1200.00,
                'is_active' => true,
            ],
        ];

        foreach ($tenants as $tenantData) {
            Tenant::create($tenantData);
        }

        // Create additional tenants for other landlords
        $otherLandlords = User::where('is_company', true)
            ->where('id', '!=', $landlord->id)
            ->limit(3)
            ->get();

        foreach ($otherLandlords as $otherLandlord) {
            Tenant::factory(rand(3, 8))->create([
                'user_id' => $otherLandlord->id,
            ]);
        }
    }
}
