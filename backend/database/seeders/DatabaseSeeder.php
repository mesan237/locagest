<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PlanSeeder::class,
            UserSeeder::class,
            PropertySeeder::class,
            TenantSeeder::class,
        ]);

        $this->command->info('Database seeded successfully!');
    }
}
