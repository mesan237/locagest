# Documentation des Modèles et Relations - Locagest Pro

**Date de création :** 19 Novembre 2025
**Statut :** ✅ Complet

---

## Vue d'ensemble

Ce document décrit tous les modèles Laravel créés pour Locagest Pro et leurs relations Eloquent.

**Total de modèles :** 17

---

## 1. User (Utilisateur/Propriétaire)

**Fichier :** `backend/app/Models/User.php`

### Propriétés importantes
- Utilise `SoftDeletes` (suppression logique)
- Utilise `HasApiTokens` (Laravel Sanctum)
- Champs additionnels : phone, company_name, siret, address, locale, timezone, is_company, avatar

### Relations
```php
hasMany(Property::class)           // Un user possède plusieurs propriétés
hasMany(Tenant::class)             // Un user gère plusieurs locataires
hasMany(Expense::class)            // Un user a plusieurs dépenses
hasOne(Subscription::class)        // Un user a une souscription active
hasMany(Subscription::class)       // Un user peut avoir plusieurs souscriptions (historique)
hasMany(Notification::class)       // Un user reçoit plusieurs notifications
```

---

## 2. Property (Bien Immobilier)

**Fichier :** `backend/app/Models/Property.php`

### Propriétés importantes
- Utilise `SoftDeletes`
- Champs JSON : `equipment` (équipements du bien)
- Géolocalisation : `latitude`, `longitude`
- DPE/GES : diagnostics énergétiques
- Référence unique : `reference` (ex: REF-2024-001)

### Relations
```php
belongsTo(User::class, 'owner_id')              // Appartient à un propriétaire
hasMany(PropertyPhoto::class)                   // A plusieurs photos
hasOne(PropertyPhoto::class)->where('is_main')  // A une photo principale
hasMany(Lease::class)                           // A plusieurs baux
hasOne(Lease::class)->where('status', 'active') // A un bail actif
hasMany(Expense::class)                         // A plusieurs dépenses
morphMany(Document::class, 'documentable')      // A plusieurs documents (polymorphic)
hasMany(PropertyInventory::class)               // A plusieurs états des lieux
```

### Méthodes utiles
- `isAvailable()` : Vérifie si le bien est disponible
- `isRented()` : Vérifie si le bien est loué

---

## 3. PropertyPhoto (Photo de Bien)

**Fichier :** `backend/app/Models/PropertyPhoto.php`

### Propriétés importantes
- `is_main` : Indique si c'est la photo principale
- `order` : Ordre d'affichage des photos
- Stockage des métadonnées : file_name, file_path, file_size, mime_type

### Relations
```php
belongsTo(Property::class)  // Appartient à un bien
```

### Accesseurs
- `getUrlAttribute()` : Retourne l'URL complète de la photo

---

## 4. Tenant (Locataire)

**Fichier :** `backend/app/Models/Tenant.php`

### Propriétés importantes
- Utilise `SoftDeletes`
- Informations complètes : identité, profession, revenus
- Documents d'identité : type, numéro, expiration

### Relations
```php
belongsTo(User::class, 'owner_id')              // Appartient à un propriétaire
hasMany(Lease::class)                           // A plusieurs baux
hasOne(Lease::class)->where('status', 'active') // A un bail actif
morphMany(Document::class, 'documentable')      // A plusieurs documents (polymorphic)
```

### Méthodes utiles
- `getFullNameAttribute()` : Nom complet
- `getAgeAttribute()` : Calcule l'âge
- `isSolvent(float $rent)` : Vérifie la solvabilité (revenu >= 3x loyer)

---

## 5. Lease (Bail/Contrat de Location)

**Fichier :** `backend/app/Models/Lease.php`

### Propriétés importantes
- Utilise `SoftDeletes`
- Référence unique : `reference` (ex: BAIL-2024-001)
- Indexation IRL : irl_base_quarter, irl_base_year, irl_base_value
- Gestion résiliation : terminated_at, termination_reason, termination_notice_date

### Relations
```php
belongsTo(Property::class)                      // Appartient à un bien
belongsTo(Tenant::class)                        // Appartient à un locataire principal
hasMany(LeaseCotenant::class)                   // A plusieurs co-locataires
hasMany(LeaseGuarantor::class)                  // A plusieurs garants
hasMany(Rent::class)                            // A plusieurs loyers
hasMany(RentRevision::class)                    // A plusieurs révisions de loyer
hasMany(Utility::class)                         // A plusieurs charges/consommations
morphMany(Document::class, 'documentable')      // A plusieurs documents (polymorphic)
hasMany(PropertyInventory::class)               // A plusieurs états des lieux
```

### Méthodes utiles
- `isActive()` : Vérifie si le bail est actif
- `isTerminated()` : Vérifie si le bail est résilié
- `getTotalMonthlyCostAttribute()` : Coût mensuel total (loyer + charges)

---

## 6. LeaseCotenant (Co-locataire)

**Fichier :** `backend/app/Models/LeaseCotenant.php`

### Propriétés importantes
- Informations du co-locataire
- Revenus mensuels pour calcul de solvabilité

### Relations
```php
belongsTo(Lease::class)  // Appartient à un bail
```

### Méthodes utiles
- `getFullNameAttribute()` : Nom complet du co-locataire

---

## 7. LeaseGuarantor (Garant)

**Fichier :** `backend/app/Models/LeaseGuarantor.php`

### Propriétés importantes
- Type : 'individual' ou 'company'
- Peut être une personne physique ou morale
- Informations complètes + revenus

### Relations
```php
belongsTo(Lease::class)  // Appartient à un bail
```

### Méthodes utiles
- `getFullNameAttribute()` : Nom complet (adapté au type)

---

## 8. Rent (Loyer)

**Fichier :** `backend/app/Models/Rent.php`

### Propriétés importantes
- Période : `period_start`, `period_end`, `due_date`
- Montants : `amount`, `charges`, `total_amount`, `paid_amount`, `balance`
- Statuts : 'pending', 'paid', 'partial', 'late'

### Relations
```php
belongsTo(Lease::class)        // Appartient à un bail
hasMany(RentPayment::class)    // A plusieurs paiements
```

### Méthodes utiles
- `isPaid()` : Vérifie si complètement payé
- `isLate()` : Vérifie si en retard
- `isPartiallyPaid()` : Vérifie si partiellement payé
- `getDaysLateAttribute()` : Nombre de jours de retard

---

## 9. RentPayment (Paiement de Loyer)

**Fichier :** `backend/app/Models/RentPayment.php`

### Propriétés importantes
- Date et montant du paiement
- Méthode de paiement
- Numéro de quittance : `receipt_number`
- Audit : `created_by`

### Relations
```php
belongsTo(Rent::class)              // Appartient à un loyer
belongsTo(User::class, 'created_by') // Créé par un utilisateur
```

---

## 10. RentRevision (Révision de Loyer)

**Fichier :** `backend/app/Models/RentRevision.php`

### Propriétés importantes
- Historique des révisions selon l'IRL
- Calcul : old_rent, new_rent, IRL values
- Formule de calcul stockée
- Pourcentage d'augmentation

### Relations
```php
belongsTo(Lease::class)                // Appartient à un bail
belongsTo(User::class, 'applied_by')   // Appliqué par un utilisateur
```

---

## 11. Utility (Charges/Consommations)

**Fichier :** `backend/app/Models/Utility.php`

### Propriétés importantes
- Types : eau, électricité, gaz, internet, etc.
- Relevés de compteur : start, end, consumption
- Prix unitaire et montant total
- Inclus ou non dans les charges

### Relations
```php
belongsTo(Lease::class)  // Appartient à un bail
```

---

## 12. Expense (Dépense)

**Fichier :** `backend/app/Models/Expense.php`

### Propriétés importantes
- Utilise `SoftDeletes`
- Catégories : travaux, entretien, assurance, taxe foncière, etc.
- Gestion TVA : vat_amount, vat_rate
- Déductibilité fiscale : is_deductible, deductible_percentage
- Facture : invoice_number, invoice_path

### Relations
```php
belongsTo(User::class, 'owner_id')    // Appartient à un propriétaire
belongsTo(Property::class)            // Liée à un bien (optionnel)
```

### Méthodes utiles
- `getDeductibleAmountAttribute()` : Calcule le montant déductible

---

## 13. Document (Document Polymorphique)

**Fichier :** `backend/app/Models/Document.php`

### Propriétés importantes
- Utilise `SoftDeletes`
- **Polymorphique** : peut appartenir à Property, Tenant, Lease, etc.
- Versioning : `version`
- Signature : `is_signed`, `signed_at`, `signed_by`
- Expiration : `expires_at`

### Relations
```php
morphTo('documentable')                  // Appartient à n'importe quel modèle
belongsTo(User::class, 'uploaded_by')    // Uploadé par un utilisateur
belongsTo(User::class, 'signed_by')      // Signé par un utilisateur
```

### Méthodes utiles
- `getUrlAttribute()` : URL complète du document
- `isExpired()` : Vérifie si expiré
- `isExpiringSoon()` : Expire dans les 30 jours

---

## 14. PropertyInventory (État des Lieux)

**Fichier :** `backend/app/Models/PropertyInventory.php`

### Propriétés importantes
- Types : 'check_in' (entrée), 'check_out' (sortie)
- Date et responsable
- Signatures locataire et propriétaire
- Relevés de compteurs (JSON)
- Nombre de clés remises
- Génération PDF : `pdf_path`

### Relations
```php
belongsTo(Property::class)                // Appartient à un bien
belongsTo(Lease::class)                   // Lié à un bail
hasMany(InventoryItem::class)             // A plusieurs items
belongsTo(User::class, 'conducted_by')    // Conduit par un utilisateur
```

---

## 15. InventoryItem (Item d'État des Lieux)

**Fichier :** `backend/app/Models/InventoryItem.php`

### Propriétés importantes
- Par pièce : `room` (salon, chambre, cuisine, etc.)
- Item : mur, sol, fenêtre, équipement, etc.
- État : 'excellent', 'good', 'fair', 'poor'
- Photo de l'état
- Réparations : `needs_repair`, `repair_cost`

### Relations
```php
belongsTo(PropertyInventory::class)  // Appartient à un état des lieux
```

---

## 16. Notification (Notification)

**Fichier :** `backend/app/Models/Notification.php`

### Propriétés importantes
- Types : rent_due, payment_received, lease_expiring, document_expiring, etc.
- Données JSON : `data`
- Action URL : lien vers la ressource concernée
- Priorité : low, medium, high, urgent
- Statut de lecture : `is_read`, `read_at`

### Relations
```php
belongsTo(User::class)  // Appartient à un utilisateur
```

### Méthodes utiles
- `markAsRead()` : Marque comme lue
- `markAsUnread()` : Marque comme non lue
- `scopeUnread()` : Scope pour les non lues
- `scopeRead()` : Scope pour les lues

---

## 17. Plan (Plan d'Abonnement)

**Fichier :** `backend/app/Models/Plan.php`

### Propriétés importantes
- Tarification : `price_monthly`, `price_yearly`
- Limites : max_properties, max_tenants, max_documents
- Features (JSON) : liste des fonctionnalités
- Essai gratuit : `trial_days`
- Actif/Inactif : `is_active`

### Relations
```php
hasMany(Subscription::class)                      // A plusieurs souscriptions
hasMany(Subscription::class)->where('active')     // Souscriptions actives
```

### Méthodes utiles
- `scopeActive()` : Scope pour les plans actifs
- `getYearlySavingsAttribute()` : % d'économie sur l'abonnement annuel

---

## 18. Subscription (Souscription)

**Fichier :** `backend/app/Models/Subscription.php`

### Propriétés importantes
- Cycle de facturation : 'monthly', 'yearly'
- Période : `starts_at`, `ends_at`, `trial_ends_at`
- Résiliation : `canceled_at`
- Intégration Stripe : `stripe_subscription_id`
- Prochains paiements : `next_payment_date`

### Relations
```php
belongsTo(User::class)  // Appartient à un utilisateur
belongsTo(Plan::class)  // Appartient à un plan
```

### Méthodes utiles
- `isActive()` : Vérifie si active
- `onTrial()` : Vérifie si en période d'essai
- `isCanceled()` : Vérifie si annulée
- `isExpired()` : Vérifie si expirée
- `scopeActive()` : Scope pour les actives
- `scopeOnTrial()` : Scope pour les essais

---

## Schéma des Relations Principales

```
User (Propriétaire)
├── properties (hasMany)
│   ├── photos (hasMany)
│   ├── leases (hasMany)
│   │   ├── tenant (belongsTo)
│   │   ├── cotenants (hasMany)
│   │   ├── guarantors (hasMany)
│   │   ├── rents (hasMany)
│   │   │   └── payments (hasMany)
│   │   ├── rentRevisions (hasMany)
│   │   ├── utilities (hasMany)
│   │   ├── documents (morphMany)
│   │   └── inventories (hasMany)
│   │       └── items (hasMany)
│   ├── expenses (hasMany)
│   └── documents (morphMany)
├── tenants (hasMany)
│   ├── leases (hasMany)
│   └── documents (morphMany)
├── expenses (hasMany)
├── subscription (hasOne)
│   └── plan (belongsTo)
└── notifications (hasMany)
```

---

## Relations Polymorphiques

Le modèle **Document** utilise une relation polymorphique et peut être attaché à :
- `Property` (contrats, diagnostics, photos, plans, etc.)
- `Tenant` (CNI, justificatifs de revenus, RIB, etc.)
- `Lease` (contrat de bail signé, avenants, etc.)

**Utilisation :**
```php
// Récupérer les documents d'un bien
$property->documents;

// Récupérer les documents d'un locataire
$tenant->documents;

// Récupérer les documents d'un bail
$lease->documents;

// Créer un document pour un bien
$property->documents()->create([...]);
```

---

## Traits Utilisés

### SoftDeletes
Modèles avec suppression logique (conserve les données avec `deleted_at`) :
- `User`
- `Property`
- `Tenant`
- `Lease`
- `Expense`
- `Document`

**Avantages :**
- Conservation de l'historique
- Possibilité de restauration
- Intégrité des données liées

### HasApiTokens (Sanctum)
- `User` : Gestion des tokens d'authentification API

---

## Conventions de Nommage

### Tables
- Pluriel en snake_case : `properties`, `lease_cotenants`, `rent_payments`

### Clés étrangères
- Format : `{model}_id` (ex: `property_id`, `tenant_id`)
- Exception pour User : `owner_id` (plus explicite)

### Références uniques
- Format : `{TYPE}-{YEAR}-{NUMBER}`
- Exemples : `REF-2024-001`, `BAIL-2024-001`

### Statuts
- Anglais : 'active', 'terminated', 'pending', 'paid', 'late'
- Enum recommandé pour validation

---

## Best Practices Implémentées

### 1. Eager Loading
Toujours charger les relations nécessaires pour éviter le problème N+1 :
```php
Property::with(['photos', 'activeLease.tenant'])->get();
Lease::with(['property', 'tenant', 'cotenants', 'guarantors'])->get();
```

### 2. Accesseurs et Mutateurs
Utilisation des accesseurs pour les calculs :
```php
$tenant->full_name           // Accesseur
$lease->total_monthly_cost   // Accesseur
$plan->yearly_savings        // Accesseur
```

### 3. Scopes
Utilisation de scopes pour les requêtes courantes :
```php
Notification::unread()->get();
Plan::active()->get();
Subscription::onTrial()->get();
```

### 4. Méthodes de vérification
Méthodes booléennes pour vérifier l'état :
```php
$property->isAvailable();
$lease->isActive();
$rent->isPaid();
$document->isExpired();
```

---

## Prochaines Étapes

1. ✅ Modèles créés avec relations
2. ⏳ Créer les Seeders pour données de test
3. ⏳ Créer les Controllers API
4. ⏳ Créer les Form Requests (validation)
5. ⏳ Créer les API Resources (transformation JSON)
6. ⏳ Implémenter les Observers (ex: LeaseObserver)
7. ⏳ Créer les Services métier
8. ⏳ Tests unitaires et d'intégration

---

**Créé le :** 19 Novembre 2025
**Dernière mise à jour :** 19 Novembre 2025
**Par :** Claude (Assistant IA)
