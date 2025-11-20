<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'Gratuit',
                'slug' => 'free',
                'description' => 'Plan gratuit pour débuter',
                'price_monthly' => 0.00,
                'price_yearly' => 0.00,
                'max_properties' => 1,
                'max_tenants' => 1,
                'max_documents' => 10,
                'features' => json_encode([
                    'Gestion de 1 propriété',
                    'Gestion de 1 locataire',
                    'Stockage de 10 documents',
                    'Tableau de bord basique',
                    'Support par email',
                ]),
                'is_active' => true,
                'display_order' => 1,
            ],
            [
                'name' => 'Starter',
                'slug' => 'starter',
                'description' => 'Idéal pour les petits bailleurs',
                'price_monthly' => 9.99,
                'price_yearly' => 99.00, // -17% si paiement annuel
                'max_properties' => 5,
                'max_tenants' => 10,
                'max_documents' => 100,
                'features' => json_encode([
                    'Gestion de 5 propriétés',
                    'Gestion de 10 locataires',
                    'Stockage de 100 documents',
                    'Tableau de bord complet',
                    'Génération de quittances',
                    'Support par email prioritaire',
                    'Export PDF',
                ]),
                'is_active' => true,
                'display_order' => 2,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'description' => 'Pour les bailleurs professionnels',
                'price_monthly' => 29.99,
                'price_yearly' => 299.00, // -17% si paiement annuel
                'max_properties' => 20,
                'max_tenants' => 50,
                'max_documents' => 500,
                'features' => json_encode([
                    'Gestion de 20 propriétés',
                    'Gestion de 50 locataires',
                    'Stockage de 500 documents',
                    'Tableau de bord avancé',
                    'Génération automatique de quittances',
                    'Rappels automatiques de loyer',
                    'Support téléphonique',
                    'Export Excel & PDF',
                    'API d\'intégration',
                    'Statistiques avancées',
                ]),
                'is_active' => true,
                'display_order' => 3,
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'Pour les grandes agences',
                'price_monthly' => 99.99,
                'price_yearly' => 999.00, // -17% si paiement annuel
                'max_properties' => null, // Illimité
                'max_tenants' => null,    // Illimité
                'max_documents' => null,  // Illimité
                'features' => json_encode([
                    'Propriétés illimitées',
                    'Locataires illimités',
                    'Documents illimités',
                    'Multi-utilisateurs',
                    'Gestion des équipes',
                    'Tableau de bord personnalisé',
                    'Automatisation complète',
                    'Support dédié 24/7',
                    'API complète',
                    'White label',
                    'Formation personnalisée',
                ]),
                'is_active' => true,
                'display_order' => 4,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}
