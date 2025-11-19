# Vérification Complète des Migrations vs Modèles

**Date :** 19 Novembre 2025
**Statut :** ✅ TOUS LES MODÈLES CORRIGÉS

---

## 📋 Résumé des Corrections

**Problème principal identifié :** Les modèles utilisaient `owner_id` comme clé étrangère, mais les migrations utilisent `user_id`.

**Solution :** Tous les modèles ont été corrigés pour correspondre exactement aux migrations (qui sont la source de vérité).

---

## ✅ Modèles Corrigés

### 1. User Model
**Fichier :** `backend/app/Models/User.php`
**Statut :** ✅ CONFORME (déjà corrigé précédemment)

**Corrections appliquées :**
- ✅ Ajout du champ `is_company` dans $fillable
- ✅ Correction de `siret` → `company_siret`

---

### 2. Property Model
**Fichier :** `backend/app/Models/Property.php`
**Migration :** `2024_01_01_000002_create_properties_table.php`

**Corrections appliquées :**
- ✅ `owner_id` → `user_id` (clé étrangère)
- ✅ Suppression des champs inexistants : `current_value`, `tax_value`, `dpe_rating`, `dpe_value`, `ges_value`, `heating_type`, `has_cellar`, `availability_date`
- ✅ Ajout des champs manquants : `energy_rating`, `is_furnished`, `estimated_value`
- ✅ Correction de la relation `owner()` pour utiliser `user_id`
- ✅ Correction des casts (latitude/longitude : decimal:7)

---

### 3. Tenant Model
**Fichier :** `backend/app/Models/Tenant.php`
**Migration :** `2024_01_01_000004_create_tenants_table.php`

**Corrections appliquées :**
- ✅ `owner_id` → `user_id` (clé étrangère)
- ✅ `mobile` → `phone_secondary`
- ✅ `date_of_birth` → `birth_date`
- ✅ `place_of_birth` → `birth_place`
- ✅ `id_card_expiry` → `id_card_expiry_date`
- ✅ Suppression des champs inexistants : `previous_address`, `status`
- ✅ Ajout du champ manquant : `is_active`
- ✅ Correction de la relation `owner()` pour utiliser `user_id`
- ✅ Correction des casts
- ✅ Correction de l'accesseur `getAgeAttribute()` pour utiliser `birth_date`

---

### 4. Lease Model
**Fichier :** `backend/app/Models/Lease.php`
**Migration :** `2024_01_01_000005_create_leases_table.php`

**Corrections appliquées :**
- ✅ `payment_day` → `rent_payment_day`
- ✅ `payment_method` → `rent_payment_method`
- ✅ Suppression des champs inexistants : `indexation_type`, `irl_base_quarter`, `irl_base_year`, `irl_base_value`, `last_revision_date`, `notice_period_owner`, `auto_renew`, `special_clauses`, `signed_at`, `terminated_at`
- ✅ Ajout des champs manquants : `charges_type`, `deposit_paid_date`, `deposit_returned_date`, `deposit_returned_amount`, `indexation_reference`, `indexation_base_value`, `indexation_date`, `last_indexation_date`, `notice_period_landlord`, `signed_date`, `termination_date`, `notes`
- ✅ Correction des casts

---

### 5. Rent Model
**Fichier :** `backend/app/Models/Rent.php`
**Migration :** `2024_01_01_000008_create_rents_table.php`

**Corrections appliquées :**
- ✅ `amount` → `rent_amount`
- ✅ `charges` → `charges_amount`
- ✅ Suppression des champs inexistants : `balance`, `payment_method`
- ✅ Ajout des champs manquants : `other_amount`, `is_auto_generated`
- ✅ Correction de la méthode `isPaid()` (removal de référence à `balance`)
- ✅ Correction des casts

---

### 6. RentPayment Model
**Fichier :** `backend/app/Models/RentPayment.php`
**Migration :** `2024_01_01_000009_create_rent_payments_table.php`

**Corrections appliquées :**
- ✅ Ajout du trait `SoftDeletes`
- ✅ `transaction_id` → `transaction_reference`
- ✅ Ajout des champs manquants : `bank_name`, `receipt_generated_at`
- ✅ Correction des casts

---

### 7. RentRevision Model
**Fichier :** `backend/app/Models/RentRevision.php`
**Migration :** `2024_01_01_000010_create_rent_revisions_table.php`

**Corrections appliquées :**
- ✅ Suppression des champs inexistants : `irl_quarter`, `irl_year`, `old_irl_value`, `new_irl_value`, `applied_by`
- ✅ Ajout des champs manquants : `indexation_reference`, `base_index`, `new_index`, `applied_from`
- ✅ Suppression de la relation `appliedBy()`
- ✅ Correction des casts (decimal:4 pour les index)

---

### 8. Utility Model
**Fichier :** `backend/app/Models/Utility.php`
**Migration :** `2024_01_01_000011_create_utilities_table.php`

**Corrections appliquées :**
- ✅ Suppression des champs inexistants : `included_in_charges`, `provider`, `meter_reading_start`, `meter_reading_end`, `notes`
- ✅ Ajout des champs manquants : `previous_meter_reading`, `current_meter_reading`, `invoice_reference`, `invoice_date`, `paid_by_tenant`
- ✅ Correction des casts

---

### 9. Expense Model
**Fichier :** `backend/app/Models/Expense.php`
**Migration :** `2024_01_01_000012_create_expenses_table.php`

**Corrections appliquées :**
- ✅ `owner_id` → `user_id` (clé étrangère)
- ✅ `supplier` → `supplier_name`
- ✅ Suppression des champs inexistants : `vat_rate`, `deductible_percentage`
- ✅ Ajout des champs manquants : `subcategory`, `payment_date`, `receipt_path`, `is_recoverable`, `recovered_amount`
- ✅ Réorganisation de l'ordre des champs pour correspondre à la migration
- ✅ Correction de la relation `owner()` pour utiliser `user_id`
- ✅ Remplacement de l'accesseur `getDeductibleAmountAttribute()` par `getRemainingRecoverableAttribute()`
- ✅ Correction des casts

---

### 10. Document Model
**Fichier :** `backend/app/Models/Document.php`
**Migration :** `2024_01_01_000013_create_documents_table.php`

**Corrections appliquées :**
- ✅ Ajout du champ manquant : `user_id`
- ✅ Suppression des champs inexistants : `description`, `signed_by`, `uploaded_by`
- ✅ Ajout des champs manquants : `category`, `is_archived`
- ✅ `signed_at` → `signed_date` (date au lieu de datetime)
- ✅ `expires_at` → `expiry_date`
- ✅ Suppression des relations `uploader()` et `signer()`
- ✅ Ajout de la relation `owner()`
- ✅ Correction des méthodes `isExpired()` et `isExpiringSoon()` pour utiliser `expiry_date`
- ✅ Correction des casts

---

### 11. PropertyPhoto Model
**Fichier :** `backend/app/Models/PropertyPhoto.php`
**Migration :** `2024_01_01_000003_create_property_photos_table.php`

**Corrections appliquées :**
- ✅ `order` → `display_order`
- ✅ Ajout des champs manquants : `width`, `height`
- ✅ Correction des casts

---

## ⚠️ Actions Requises

### 1. Recréer la base de données

Les modèles ont été corrigés pour correspondre aux migrations. Vous devez maintenant recréer la base de données :

```bash
cd backend

# Option 1 : Recréer toute la base de données (EFFACE TOUT)
php artisan migrate:fresh

# Option 2 : Rollback et refaire (si vous avez des données)
php artisan migrate:rollback --step=all
php artisan migrate
```

### 2. Tester l'API

Après avoir recréé la base de données, testez l'API Register avec Postman :

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+33612345678",
  "company_name": "Ma Société",
  "company_siret": "12345678901234",
  "is_company": false
}
```

**Résultat attendu :** ✅ 201 Created (sans erreur)

---

## 📊 Statistiques

- **Modèles vérifiés :** 18/18
- **Modèles corrigés :** 11
- **Modèles déjà conformes :** 7 (LeaseCotenant, LeaseGuarantor, PropertyInventory, InventoryItem, Notification, Plan, Subscription)
- **Champs corrigés :** 80+
- **Relations corrigées :** 8

---

## 🔧 Modèles Non Modifiés

Les modèles suivants correspondent déjà à leurs migrations (vérifiés mais non modifiés) :

- ✅ LeaseCotenant
- ✅ LeaseGuarantor
- ✅ PropertyInventory
- ✅ InventoryItem
- ✅ Notification
- ✅ Plan
- ✅ Subscription

---

## 📝 Checklist Post-Corrections

- [x] Vérification complète des 18 migrations
- [x] Correction de tous les modèles
- [x] Correction du champ `is_company` dans la migration users
- [ ] `php artisan migrate:fresh` exécuté
- [ ] Aucune erreur de migration
- [ ] Test API Register réussi
- [ ] Test API Login réussi
- [ ] Test API Me réussi

---

## ⚠️ Note Importante

**Tous les modèles utilisent maintenant `user_id` comme clé étrangère vers la table `users`, conformément aux migrations.**

Ceci assure la cohérence entre la base de données (définie par les migrations) et les modèles Eloquent.

---

**Dernière mise à jour :** 19 Novembre 2025 - Vérification complète terminée
