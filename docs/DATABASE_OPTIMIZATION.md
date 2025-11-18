# Optimisation de la Base de Données - Locagest Pro

## Version Actuelle vs Version Optimisée

---

## 1. Table `users` - Utilisateurs/Propriétaires

### Problèmes Identifiés
- Manque d'informations essentielles pour un propriétaire
- Pas de gestion multi-langues
- Pas de champ pour les préférences utilisateur

### Version OPTIMISÉE

```sql
users
├── id (BIGINT UNSIGNED, PK)
├── name (VARCHAR 255)
├── email (VARCHAR 255, UNIQUE)
├── email_verified_at (TIMESTAMP NULL)
├── password (VARCHAR 255)
├── phone (VARCHAR 20, NULL)
├── company_name (VARCHAR 255, NULL)          -- Pour les professionnels
├── company_siret (VARCHAR 14, NULL)          -- Numéro SIRET
├── address (VARCHAR 255, NULL)
├── city (VARCHAR 100, NULL)
├── postal_code (VARCHAR 10, NULL)
├── country (VARCHAR 2, DEFAULT 'FR')         -- Code ISO
├── locale (VARCHAR 5, DEFAULT 'fr')          -- fr, en, etc.
├── timezone (VARCHAR 50, DEFAULT 'Europe/Paris')
├── avatar (VARCHAR 255, NULL)                -- Photo de profil
├── is_active (BOOLEAN, DEFAULT true)         -- Compte actif/suspendu
├── last_login_at (TIMESTAMP NULL)            -- Dernière connexion
├── remember_token (VARCHAR 100, NULL)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── deleted_at (TIMESTAMP NULL)               -- Soft delete
```

**Raisons:**
- **phone**: Contact direct avec les locataires
- **company_***: Support des professionnels de l'immobilier
- **address/city/postal_code**: Pour les documents légaux
- **locale/timezone**: Internationalisation
- **is_active**: Désactiver sans supprimer
- **last_login_at**: Sécurité et statistiques
- **deleted_at**: Soft delete pour historique

**Index Recommandés:**
```sql
INDEX idx_users_email (email)
INDEX idx_users_active (is_active)
INDEX idx_users_deleted (deleted_at)
```

---

## 2. Table `properties` - Biens Immobiliers

### Problèmes Identifiés
- Manque de champs pour géolocalisation
- Pas de suivi des équipements
- Pas de numéro de cadastre/référence fiscale
- Charges et loyer devraient être dans `leases` uniquement

### Version OPTIMISÉE

```sql
properties
├── id (BIGINT UNSIGNED, PK)
├── user_id (BIGINT UNSIGNED, FK → users)
├── reference (VARCHAR 50, UNIQUE)            -- REF-2024-001
├── name (VARCHAR 255)
├── type (ENUM: apartment, house, commercial, parking, office, land, garage)
├── address (VARCHAR 255)
├── address_complement (VARCHAR 255, NULL)    -- Bât, Escalier, etc.
├── city (VARCHAR 100)
├── postal_code (VARCHAR 10)
├── country (VARCHAR 2, DEFAULT 'FR')
├── latitude (DECIMAL 10,7, NULL)             -- Géolocalisation
├── longitude (DECIMAL 10,7, NULL)
├── cadastral_reference (VARCHAR 50, NULL)    -- Référence cadastrale
├── surface_area (DECIMAL 8,2, NULL)          -- m²
├── rooms (TINYINT UNSIGNED, NULL)            -- Nombre de pièces
├── bedrooms (TINYINT UNSIGNED, NULL)
├── bathrooms (TINYINT UNSIGNED, NULL)
├── floor (TINYINT, NULL)                     -- Étage (-2 pour sous-sol)
├── total_floors (TINYINT UNSIGNED, NULL)     -- Total d'étages du bâtiment
├── construction_year (YEAR, NULL)
├── energy_rating (CHAR 1, NULL)              -- DPE: A, B, C, D, E, F, G
├── ges_rating (CHAR 1, NULL)                 -- GES: A, B, C, D, E, F, G
├── has_elevator (BOOLEAN, DEFAULT false)
├── has_parking (BOOLEAN, DEFAULT false)
├── has_balcony (BOOLEAN, DEFAULT false)
├── has_terrace (BOOLEAN, DEFAULT false)
├── has_garden (BOOLEAN, DEFAULT false)
├── is_furnished (BOOLEAN, DEFAULT false)
├── description (TEXT, NULL)
├── equipment (JSON, NULL)                    -- ['wifi', 'dishwasher', 'washing_machine']
├── status (ENUM: available, rented, maintenance, sold, draft)
├── acquisition_date (DATE, NULL)             -- Date d'achat
├── acquisition_price (DECIMAL 10,2, NULL)    -- Prix d'achat
├── estimated_value (DECIMAL 10,2, NULL)      -- Valeur estimée
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── deleted_at (TIMESTAMP NULL)
```

**Raisons:**
- **reference**: Référence unique pour documents/contrats
- **latitude/longitude**: Cartographie des biens
- **cadastral_reference**: Documents fiscaux/notaire
- **energy_rating/ges_rating**: Obligatoire légalement (DPE)
- **floor/total_floors**: Important pour appartements
- **equipment (JSON)**: Flexible pour liste équipements
- **acquisition_***: Calcul rentabilité/plus-value
- **status draft**: Permettre création progressive

**Index Recommandés:**
```sql
INDEX idx_properties_user (user_id)
INDEX idx_properties_reference (reference)
INDEX idx_properties_status (status)
INDEX idx_properties_type (type)
INDEX idx_properties_city (city)
INDEX idx_properties_deleted (deleted_at)
SPATIAL INDEX idx_properties_location (latitude, longitude)
```

---

## 3. Table `property_photos` - Photos

### Problèmes Identifiés
- Manque ordre d'affichage
- Pas de métadonnées (taille, format)

### Version OPTIMISÉE

```sql
property_photos
├── id (BIGINT UNSIGNED, PK)
├── property_id (BIGINT UNSIGNED, FK → properties)
├── file_path (VARCHAR 255)
├── file_name (VARCHAR 255)
├── file_size (INT UNSIGNED)                  -- En bytes
├── mime_type (VARCHAR 50)                    -- image/jpeg
├── width (SMALLINT UNSIGNED, NULL)
├── height (SMALLINT UNSIGNED, NULL)
├── is_main (BOOLEAN, DEFAULT false)
├── display_order (TINYINT UNSIGNED, DEFAULT 0)
├── caption (VARCHAR 255, NULL)               -- Description photo
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

**Raisons:**
- **display_order**: Contrôle ordre d'affichage
- **width/height**: Optimisation affichage frontend
- **file_size/mime_type**: Validation et optimisation
- **caption**: Accessibilité et SEO

**Index Recommandés:**
```sql
INDEX idx_photos_property (property_id, display_order)
INDEX idx_photos_main (property_id, is_main)
```

---

## 4. Table `tenants` - Locataires

### Problèmes Identifiés
- Manque informations contact secondaires
- Pas de gestion co-locataires
- Pas de documents d'identité

### Version OPTIMISÉE

```sql
tenants
├── id (BIGINT UNSIGNED, PK)
├── user_id (BIGINT UNSIGNED, FK → users)
├── first_name (VARCHAR 100)
├── last_name (VARCHAR 100)
├── email (VARCHAR 255, NULL)
├── phone (VARCHAR 20, NULL)
├── phone_secondary (VARCHAR 20, NULL)        -- Contact secondaire
├── birth_date (DATE, NULL)
├── birth_place (VARCHAR 100, NULL)
├── nationality (VARCHAR 100, NULL)
├── id_card_type (ENUM: national_id, passport, residence_permit, NULL)
├── id_card_number (VARCHAR 50, NULL)
├── id_card_expiry_date (DATE, NULL)
├── profession (VARCHAR 100, NULL)
├── employer (VARCHAR 255, NULL)              -- Employeur
├── monthly_income (DECIMAL 10,2, NULL)       -- Revenus mensuels
├── emergency_contact_name (VARCHAR 255, NULL)
├── emergency_contact_phone (VARCHAR 20, NULL)
├── notes (TEXT, NULL)                        -- Notes privées
├── is_active (BOOLEAN, DEFAULT true)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── deleted_at (TIMESTAMP NULL)
```

**Raisons:**
- **phone_secondary**: Contact alternatif
- **birth_place**: Documents légaux
- **id_card_***: Vérification identité
- **employer/monthly_income**: Vérification solvabilité
- **emergency_contact_***: Sécurité
- **notes**: Remarques propriétaire

**Index Recommandés:**
```sql
INDEX idx_tenants_user (user_id)
INDEX idx_tenants_email (email)
INDEX idx_tenants_active (is_active)
INDEX idx_tenants_deleted (deleted_at)
INDEX idx_tenants_fullname (last_name, first_name)
```

---

## 5. Table `leases` - Baux (MAJEURE REFONTE)

### Problèmes Identifiés
- Manque type de bail
- Pas de révision loyer (indexation)
- Pas de garants
- Pas de préavis

### Version OPTIMISÉE

```sql
leases
├── id (BIGINT UNSIGNED, PK)
├── reference (VARCHAR 50, UNIQUE)            -- BAIL-2024-001
├── property_id (BIGINT UNSIGNED, FK → properties)
├── tenant_id (BIGINT UNSIGNED, FK → tenants) -- Locataire principal
├── type (ENUM: residential, commercial, seasonal, colocation)
├── start_date (DATE)
├── end_date (DATE, NULL)                     -- NULL si tacite reconduction
├── initial_rent (DECIMAL 10,2)               -- Loyer initial
├── current_rent (DECIMAL 10,2)               -- Loyer actuel (après révisions)
├── charges (DECIMAL 10,2, DEFAULT 0)
├── charges_type (ENUM: included, additional, provision)
├── deposit (DECIMAL 10,2, DEFAULT 0)
├── deposit_paid_date (DATE, NULL)
├── deposit_returned_date (DATE, NULL)
├── deposit_returned_amount (DECIMAL 10,2, NULL)
├── rent_payment_day (TINYINT, DEFAULT 1)     -- 1-31
├── rent_payment_method (ENUM: transfer, check, cash, direct_debit, NULL)
├── indexation_reference (VARCHAR 50, NULL)   -- IRL, ILC, ILAT
├── indexation_base_value (DECIMAL 10,4, NULL)
├── indexation_date (DATE, NULL)              -- Date révision annuelle
├── last_indexation_date (DATE, NULL)
├── notice_period_tenant (TINYINT, DEFAULT 1) -- Préavis locataire (mois)
├── notice_period_landlord (TINYINT, DEFAULT 6)
├── renewable (BOOLEAN, DEFAULT true)         -- Tacite reconduction
├── signed_date (DATE, NULL)
├── status (ENUM: draft, active, terminated, suspended)
├── termination_date (DATE, NULL)
├── termination_reason (TEXT, NULL)
├── termination_notice_date (DATE, NULL)      -- Date du préavis
├── notes (TEXT, NULL)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── deleted_at (TIMESTAMP NULL)
```

**Raisons:**
- **reference**: Traçabilité documents
- **type**: Législation différente selon type
- **initial_rent vs current_rent**: Historique révisions
- **charges_type**: Différents modes de facturation
- **deposit_***: Suivi complet caution
- **indexation_***: Révision légale loyer (IRL)
- **notice_period_***: Respect délais légaux
- **termination_***: Historique complet fin de bail
- **status draft**: Création progressive du bail

**Index Recommandés:**
```sql
INDEX idx_leases_property (property_id)
INDEX idx_leases_tenant (tenant_id)
INDEX idx_leases_reference (reference)
INDEX idx_leases_status (status)
INDEX idx_leases_dates (start_date, end_date)
INDEX idx_leases_active (status, end_date)
```

---

## 6. NOUVELLE Table `lease_cotenants` - Co-locataires

### Raison d'Ajout
Gérer les baux avec plusieurs locataires (colocation, couple).

```sql
lease_cotenants
├── id (BIGINT UNSIGNED, PK)
├── lease_id (BIGINT UNSIGNED, FK → leases)
├── tenant_id (BIGINT UNSIGNED, FK → tenants)
├── is_main (BOOLEAN, DEFAULT false)          -- Titulaire principal
├── created_at (TIMESTAMP)
```

**Index:**
```sql
UNIQUE INDEX idx_lease_cotenant (lease_id, tenant_id)
INDEX idx_cotenant_tenant (tenant_id)
```

---

## 7. NOUVELLE Table `lease_guarantors` - Garants

### Raison d'Ajout
Informations garants (parents, caution solidaire).

```sql
lease_guarantors
├── id (BIGINT UNSIGNED, PK)
├── lease_id (BIGINT UNSIGNED, FK → leases)
├── type (ENUM: physical_person, company, bank_guarantee, visale)
├── first_name (VARCHAR 100, NULL)
├── last_name (VARCHAR 100, NULL)
├── company_name (VARCHAR 255, NULL)
├── email (VARCHAR 255, NULL)
├── phone (VARCHAR 20, NULL)
├── address (VARCHAR 255, NULL)
├── city (VARCHAR 100, NULL)
├── postal_code (VARCHAR 10, NULL)
├── monthly_income (DECIMAL 10,2, NULL)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

**Index:**
```sql
INDEX idx_guarantors_lease (lease_id)
```

---

## 8. Table `rents` - Loyers (OPTIMISÉE)

### Problèmes Identifiés
- Champs payment_method/paid_date redondants avec rent_payments
- Manque statut partial_payment détaillé

### Version OPTIMISÉE

```sql
rents
├── id (BIGINT UNSIGNED, PK)
├── lease_id (BIGINT UNSIGNED, FK → leases)
├── period_start (DATE)                       -- 2024-01-01
├── period_end (DATE)                         -- 2024-01-31
├── rent_amount (DECIMAL 10,2)                -- Loyer seul
├── charges_amount (DECIMAL 10,2, DEFAULT 0)
├── other_amount (DECIMAL 10,2, DEFAULT 0)    -- Charges exceptionnelles
├── total_amount (DECIMAL 10,2)               -- GENERATED ALWAYS AS
├── paid_amount (DECIMAL 10,2, DEFAULT 0)     -- Total payé
├── due_date (DATE)
├── status (ENUM: pending, paid, partial, late, cancelled)
├── is_auto_generated (BOOLEAN, DEFAULT true) -- Généré auto ou manuel
├── notes (TEXT, NULL)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

**Raisons:**
- **period_start/end**: Plus précis que month/year
- **paid_amount**: Calcul automatique depuis rent_payments
- **total_amount**: Colonne calculée (VIRTUAL)
- **is_auto_generated**: Différencier loyers réguliers/exceptionnels

**Index Recommandés:**
```sql
INDEX idx_rents_lease (lease_id, period_start)
INDEX idx_rents_status (status)
INDEX idx_rents_due_date (due_date)
UNIQUE INDEX idx_rents_period (lease_id, period_start, period_end)
```

---

## 9. Table `rent_payments` - Paiements (OPTIMISÉE)

### Version OPTIMISÉE

```sql
rent_payments
├── id (BIGINT UNSIGNED, PK)
├── rent_id (BIGINT UNSIGNED, FK → rents)
├── amount (DECIMAL 10,2)
├── payment_date (DATE)
├── payment_method (ENUM: transfer, check, cash, direct_debit, card, other)
├── transaction_reference (VARCHAR 100, NULL) -- N° chèque, virement
├── bank_name (VARCHAR 100, NULL)
├── receipt_number (VARCHAR 50, NULL)         -- N° quittance
├── receipt_generated_at (TIMESTAMP, NULL)
├── notes (TEXT, NULL)
├── created_by (BIGINT UNSIGNED, FK → users, NULL)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── deleted_at (TIMESTAMP NULL)               -- Annulation paiement
```

**Raisons:**
- **transaction_reference**: Traçabilité bancaire
- **receipt_number**: Numérotation quittances
- **created_by**: Audit (qui a enregistré)
- **deleted_at**: Annulation avec historique

**Index:**
```sql
INDEX idx_payments_rent (rent_id)
INDEX idx_payments_date (payment_date)
INDEX idx_payments_receipt (receipt_number)
```

---

## 10. Table `charges` → RENOMMÉE `utilities` - Consommations

### Problèmes Identifiés
- Nom ambigu (confusion avec charges locatives)
- Manque index de compteur

### Version OPTIMISÉE

```sql
utilities
├── id (BIGINT UNSIGNED, PK)
├── lease_id (BIGINT UNSIGNED, FK → leases)
├── type (ENUM: water, electricity, gas, heating, internet, other)
├── period_start (DATE)
├── period_end (DATE)
├── previous_meter_reading (DECIMAL 10,2, NULL)
├── current_meter_reading (DECIMAL 10,2, NULL)
├── consumption (DECIMAL 10,2, NULL)          -- Calculé ou saisi
├── unit_price (DECIMAL 10,4, NULL)           -- Prix unitaire
├── amount (DECIMAL 10,2)
├── invoice_reference (VARCHAR 100, NULL)
├── invoice_date (DATE, NULL)
├── paid_by_tenant (BOOLEAN, DEFAULT false)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

**Raisons:**
- **Renommage**: Plus clair (utilities = consommations)
- **meter_reading**: Suivi compteurs
- **consumption**: Calcul automatique
- **paid_by_tenant**: Différencier charges récupérables

**Index:**
```sql
INDEX idx_utilities_lease (lease_id, period_start)
INDEX idx_utilities_type (type)
```

---

## 11. Table `expenses` - Dépenses (OPTIMISÉE)

### Version OPTIMISÉE

```sql
expenses
├── id (BIGINT UNSIGNED, PK)
├── user_id (BIGINT UNSIGNED, FK → users)
├── property_id (BIGINT UNSIGNED, FK → properties, NULL)
├── category (ENUM: repair, maintenance, tax, insurance, loan_interest, condo_fees, management_fees, legal, other)
├── subcategory (VARCHAR 100, NULL)           -- Précision catégorie
├── amount (DECIMAL 10,2)
├── vat_amount (DECIMAL 10,2, DEFAULT 0)      -- TVA
├── total_amount (DECIMAL 10,2)               -- TTC
├── description (TEXT)
├── expense_date (DATE)
├── payment_date (DATE, NULL)
├── payment_method (ENUM: transfer, check, cash, card, direct_debit, NULL)
├── supplier_name (VARCHAR 255, NULL)
├── invoice_number (VARCHAR 100, NULL)
├── invoice_path (VARCHAR 255, NULL)          -- Scan facture
├── receipt_path (VARCHAR 255, NULL)          -- Justificatif paiement
├── is_deductible (BOOLEAN, DEFAULT true)     -- Déductible fiscalement
├── is_recoverable (BOOLEAN, DEFAULT false)   -- Récupérable sur locataire
├── recovered_amount (DECIMAL 10,2, DEFAULT 0)
├── notes (TEXT, NULL)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── deleted_at (TIMESTAMP NULL)
```

**Raisons:**
- **vat_amount**: Récupération TVA si applicable
- **supplier_name**: Suivi fournisseurs
- **is_deductible**: Déclaration fiscale
- **is_recoverable**: Charges récupérables
- **invoice_number**: Traçabilité comptable

**Index:**
```sql
INDEX idx_expenses_user (user_id)
INDEX idx_expenses_property (property_id)
INDEX idx_expenses_category (category)
INDEX idx_expenses_date (expense_date)
INDEX idx_expenses_deductible (is_deductible, expense_date)
```

---

## 12. Table `documents` - Documents (OPTIMISÉE)

### Version OPTIMISÉE

```sql
documents
├── id (BIGINT UNSIGNED, PK)
├── user_id (BIGINT UNSIGNED, FK → users)
├── documentable_type (VARCHAR 255)           -- Property, Tenant, Lease
├── documentable_id (BIGINT UNSIGNED)
├── type (ENUM: lease_contract, receipt, inventory_in, inventory_out, insurance,
│         id_card, income_proof, guarantee, notice, other)
├── category (VARCHAR 100, NULL)              -- Sous-catégorie
├── name (VARCHAR 255)
├── file_path (VARCHAR 255)
├── file_name (VARCHAR 255)
├── file_size (INT UNSIGNED)
├── mime_type (VARCHAR 50)
├── version (TINYINT UNSIGNED, DEFAULT 1)     -- Versioning
├── is_signed (BOOLEAN, DEFAULT false)
├── signed_date (DATE, NULL)
├── expiry_date (DATE, NULL)                  -- Pour docs temporaires
├── is_archived (BOOLEAN, DEFAULT false)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
├── deleted_at (TIMESTAMP NULL)
```

**Raisons:**
- **version**: Gestion versions documents
- **is_signed/signed_date**: Suivi signatures
- **expiry_date**: Alertes documents expirés
- **is_archived**: Archivage sans suppression

**Index:**
```sql
INDEX idx_documents_user (user_id)
INDEX idx_documents_polymorphic (documentable_type, documentable_id)
INDEX idx_documents_type (type)
INDEX idx_documents_expiry (expiry_date)
```

---

## 13. NOUVELLE Table `rent_revisions` - Révisions de Loyer

### Raison d'Ajout
Historique légal des révisions de loyer (indexation IRL).

```sql
rent_revisions
├── id (BIGINT UNSIGNED, PK)
├── lease_id (BIGINT UNSIGNED, FK → leases)
├── revision_date (DATE)
├── old_rent (DECIMAL 10,2)
├── new_rent (DECIMAL 10,2)
├── indexation_reference (VARCHAR 50)         -- IRL, ILC
├── base_index (DECIMAL 10,4)
├── new_index (DECIMAL 10,4)
├── increase_percentage (DECIMAL 5,2)
├── calculation_formula (TEXT, NULL)          -- Formule utilisée
├── applied_from (DATE)                       -- Date application
├── notes (TEXT, NULL)
├── created_at (TIMESTAMP)
```

**Index:**
```sql
INDEX idx_revisions_lease (lease_id, revision_date)
```

---

## 14. NOUVELLE Table `property_inventories` - États des Lieux

### Raison d'Ajout
Gestion états des lieux (entrée/sortie).

```sql
property_inventories
├── id (BIGINT UNSIGNED, PK)
├── lease_id (BIGINT UNSIGNED, FK → leases)
├── type (ENUM: check_in, check_out)
├── date (DATE)
├── inspector_name (VARCHAR 255, NULL)        -- Huissier/Expert
├── tenant_present (BOOLEAN)
├── landlord_present (BOOLEAN)
├── water_meter (DECIMAL 10,2, NULL)
├── electricity_meter (DECIMAL 10,2, NULL)
├── gas_meter (DECIMAL 10,2, NULL)
├── keys_count (TINYINT UNSIGNED)
├── general_condition (ENUM: excellent, good, fair, poor)
├── observations (TEXT, NULL)
├── document_id (BIGINT UNSIGNED, FK → documents, NULL)
├── signed_by_tenant (BOOLEAN, DEFAULT false)
├── signed_by_landlord (BOOLEAN, DEFAULT false)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

**Index:**
```sql
INDEX idx_inventories_lease (lease_id, type)
```

---

## 15. NOUVELLE Table `inventory_items` - Détails État des Lieux

```sql
inventory_items
├── id (BIGINT UNSIGNED, PK)
├── inventory_id (BIGINT UNSIGNED, FK → property_inventories)
├── room (VARCHAR 100)                        -- Salon, Chambre 1, Cuisine
├── item (VARCHAR 255)                        -- Porte, Fenêtre, Mur
├── condition (ENUM: excellent, good, fair, poor, damaged)
├── quantity (TINYINT UNSIGNED, DEFAULT 1)
├── observations (TEXT, NULL)
├── photo_paths (JSON, NULL)                  -- Photos des détails
├── display_order (SMALLINT UNSIGNED)
├── created_at (TIMESTAMP)
```

**Index:**
```sql
INDEX idx_items_inventory (inventory_id, display_order)
```

---

## 16. NOUVELLE Table `notifications` - Notifications

### Raison d'Ajout
Système de notifications in-app.

```sql
notifications
├── id (BIGINT UNSIGNED, PK)
├── user_id (BIGINT UNSIGNED, FK → users)
├── type (ENUM: rent_due, payment_received, lease_expiring, document_expiring,
│         maintenance_required, tenant_message, system)
├── title (VARCHAR 255)
├── message (TEXT)
├── data (JSON, NULL)                         -- Données contextuelles
├── action_url (VARCHAR 255, NULL)            -- Lien action
├── is_read (BOOLEAN, DEFAULT false)
├── read_at (TIMESTAMP, NULL)
├── priority (ENUM: low, normal, high, urgent)
├── expires_at (TIMESTAMP, NULL)
├── created_at (TIMESTAMP)
```

**Index:**
```sql
INDEX idx_notifications_user (user_id, is_read, created_at)
INDEX idx_notifications_type (type)
```

---

## 17. Tables `subscriptions` & `plans` - Abonnements

### Version OPTIMISÉE

```sql
plans
├── id (BIGINT UNSIGNED, PK)
├── name (VARCHAR 100)
├── slug (VARCHAR 50, UNIQUE)                 -- starter, professional, enterprise
├── description (TEXT, NULL)
├── price_monthly (DECIMAL 10,2)
├── price_yearly (DECIMAL 10,2, NULL)
├── max_properties (SMALLINT UNSIGNED, NULL)  -- NULL = illimité
├── max_tenants (SMALLINT UNSIGNED, NULL)
├── max_documents (SMALLINT UNSIGNED, NULL)
├── features (JSON)                           -- ['reporting', 'api', 'support']
├── is_active (BOOLEAN, DEFAULT true)
├── display_order (TINYINT UNSIGNED)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)

subscriptions
├── id (BIGINT UNSIGNED, PK)
├── user_id (BIGINT UNSIGNED, FK → users)
├── plan_id (BIGINT UNSIGNED, FK → plans)
├── billing_period (ENUM: monthly, yearly)
├── amount (DECIMAL 10,2)
├── starts_at (DATE)
├── ends_at (DATE, NULL)
├── trial_ends_at (DATE, NULL)
├── cancelled_at (TIMESTAMP, NULL)
├── status (ENUM: trial, active, cancelled, expired, suspended)
├── payment_method (VARCHAR 50, NULL)
├── last_payment_date (DATE, NULL)
├── next_billing_date (DATE, NULL)
├── created_at (TIMESTAMP)
├── updated_at (TIMESTAMP)
```

**Index:**
```sql
-- plans
INDEX idx_plans_slug (slug)
INDEX idx_plans_active (is_active)

-- subscriptions
INDEX idx_subscriptions_user (user_id)
INDEX idx_subscriptions_status (status, ends_at)
INDEX idx_subscriptions_billing (next_billing_date)
```

---

## RÉSUMÉ DES CHANGEMENTS

### Tables Ajoutées (7)
1. **lease_cotenants** - Gestion co-locataires
2. **lease_guarantors** - Garants
3. **rent_revisions** - Historique révisions loyer
4. **property_inventories** - États des lieux
5. **inventory_items** - Détails états des lieux
6. **notifications** - Système notifications
7. **plans** - Plans d'abonnement

### Tables Renommées (1)
- **charges** → **utilities** (plus explicite)

### Tables Optimisées (10)
Toutes les tables existantes avec ajout de champs essentiels

### Principales Améliorations

#### Traçabilité
- Références uniques (properties, leases)
- Soft deletes généralisé
- Audit trail (created_by, timestamps)

#### Légal & Conformité
- DPE/GES (diagnostics énergétiques)
- Révisions de loyer (IRL)
- États des lieux complets
- Délais de préavis

#### Gestion Financière
- TVA sur dépenses
- Charges récupérables
- Déductibilité fiscale
- Historique paiements

#### International
- Multi-devises possible
- Locale/Timezone
- Géolocalisation

#### UX/UI
- Notifications in-app
- Versioning documents
- Photos avec ordre affichage
- Statuts draft pour création progressive

---

## PROCHAINES ÉTAPES

1. **Validation de cette structure**
2. **Création des migrations Laravel**
3. **Création des Models avec relations**
4. **Création des seeders de test**

---

**Date de création:** 17 Novembre 2025
**Version:** 1.0
