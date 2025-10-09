# 🏗️ Structure du Projet Locagest Pro

## 📁 Architecture Globale

```
locagest/
├── backend/           # API Laravel
├── frontend/          # Application React
└── docs/             # Documentation du projet
```

---

## 🔧 Backend (Laravel 11)

### Structure des Dossiers

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── PropertyController.php
│   │   │   │   ├── TenantController.php
│   │   │   │   ├── LeaseController.php
│   │   │   │   ├── RentController.php
│   │   │   │   ├── DocumentController.php
│   │   │   │   └── DashboardController.php
│   │   ├── Middleware/
│   │   │   └── CheckSubscription.php
│   │   ├── Requests/
│   │   │   ├── Property/
│   │   │   │   ├── StorePropertyRequest.php
│   │   │   │   └── UpdatePropertyRequest.php
│   │   │   ├── Tenant/
│   │   │   └── Lease/
│   │   └── Resources/
│   │       ├── PropertyResource.php
│   │       ├── TenantResource.php
│   │       └── LeaseResource.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Property.php
│   │   ├── PropertyPhoto.php
│   │   ├── Tenant.php
│   │   ├── Lease.php
│   │   ├── Rent.php
│   │   ├── RentPayment.php
│   │   ├── Charge.php
│   │   ├── Expense.php
│   │   ├── Document.php
│   │   ├── Subscription.php
│   │   └── Plan.php
│   ├── Services/
│   │   ├── PropertyService.php
│   │   ├── LeaseService.php
│   │   ├── RentService.php
│   │   ├── DocumentGeneratorService.php
│   │   ├── PaymentService.php
│   │   └── NotificationService.php
│   ├── Repositories/
│   │   ├── PropertyRepository.php
│   │   ├── TenantRepository.php
│   │   └── LeaseRepository.php
│   ├── Jobs/
│   │   ├── GenerateMonthlyRents.php
│   │   ├── SendRentReminders.php
│   │   └── GenerateReceipt.php
│   ├── Notifications/
│   │   ├── RentDueNotification.php
│   │   ├── PaymentReceivedNotification.php
│   │   └── LeaseExpiringNotification.php
│   └── Observers/
│       └── LeaseObserver.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_properties_table.php
│   │   ├── 2024_01_01_000002_create_property_photos_table.php
│   │   ├── 2024_01_01_000003_create_tenants_table.php
│   │   ├── 2024_01_01_000004_create_leases_table.php
│   │   ├── 2024_01_01_000005_create_rents_table.php
│   │   ├── 2024_01_01_000006_create_rent_payments_table.php
│   │   ├── 2024_01_01_000007_create_charges_table.php
│   │   ├── 2024_01_01_000008_create_expenses_table.php
│   │   ├── 2024_01_01_000009_create_documents_table.php
│   │   └── 2024_01_01_000010_create_subscriptions_table.php
│   ├── seeders/
│   │   ├── DatabaseSeeder.php
│   │   ├── UserSeeder.php
│   │   ├── PropertySeeder.php
│   │   └── PlanSeeder.php
│   └── factories/
│       ├── PropertyFactory.php
│       └── TenantFactory.php
├── routes/
│   ├── api.php
│   └── web.php
├── config/
│   ├── cors.php
│   └── sanctum.php
└── storage/
    ├── app/
    │   ├── documents/
    │   ├── receipts/
    │   └── photos/
    └── logs/
```

### Routes API (routes/api.php)

```php
// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    // Properties
    Route::apiResource('properties', PropertyController::class);
    Route::post('properties/{property}/photos', [PropertyController::class, 'uploadPhotos']);

    // Tenants
    Route::apiResource('tenants', TenantController::class);

    // Leases
    Route::apiResource('leases', LeaseController::class);
    Route::post('leases/{lease}/terminate', [LeaseController::class, 'terminate']);

    // Rents
    Route::get('leases/{lease}/rents', [RentController::class, 'index']);
    Route::post('rents/{rent}/pay', [RentController::class, 'recordPayment']);
    Route::get('rents/{rent}/receipt', [RentController::class, 'downloadReceipt']);

    // Documents
    Route::apiResource('documents', DocumentController::class);
});
```

---

## ⚛️ Frontend (React + TypeScript)

### Structure des Dossiers

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.ts              # Configuration Axios
│   │   ├── auth.ts                # API Auth
│   │   ├── properties.ts          # API Properties
│   │   ├── tenants.ts             # API Tenants
│   │   ├── leases.ts              # API Leases
│   │   └── rents.ts               # API Rents
│   ├── components/
│   │   ├── ui/                    # Composants UI réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   └── Badge.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx      # Layout principal
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── features/              # Composants métier
│   │       ├── auth/
│   │       │   ├── LoginForm.tsx
│   │       │   └── RegisterForm.tsx
│   │       ├── properties/
│   │       │   ├── PropertyCard.tsx
│   │       │   ├── PropertyForm.tsx
│   │       │   └── PropertyList.tsx
│   │       ├── tenants/
│   │       │   ├── TenantCard.tsx
│   │       │   └── TenantForm.tsx
│   │       ├── leases/
│   │       │   ├── LeaseForm.tsx
│   │       │   └── LeaseDetails.tsx
│   │       ├── finances/
│   │       │   ├── RentCalendar.tsx
│   │       │   ├── PaymentForm.tsx
│   │       │   └── FinanceChart.tsx
│   │       └── dashboard/
│   │           ├── StatsCard.tsx
│   │           └── RecentActivity.tsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx
│   │   ├── properties/
│   │   │   ├── PropertiesPage.tsx
│   │   │   ├── PropertyDetails.tsx
│   │   │   └── CreateProperty.tsx
│   │   ├── tenants/
│   │   │   ├── TenantsPage.tsx
│   │   │   └── TenantDetails.tsx
│   │   ├── leases/
│   │   │   ├── LeasesPage.tsx
│   │   │   └── LeaseDetails.tsx
│   │   ├── finances/
│   │   │   ├── RentsPage.tsx
│   │   │   └── ExpensesPage.tsx
│   │   └── settings/
│   │       └── SettingsPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useProperties.ts
│   │   ├── useTenants.ts
│   │   ├── useLeases.ts
│   │   └── useDebounce.ts
│   ├── stores/
│   │   ├── authStore.ts           # État global auth
│   │   └── uiStore.ts             # État UI (sidebar, modals)
│   ├── types/
│   │   └── index.ts               # Types TypeScript
│   ├── utils/
│   │   ├── formatters.ts          # Formatage dates, prix
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── .env
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🗄️ Base de Données MySQL

### Schema Principal

```sql
-- Utilisateurs (propriétaires)
users
├── id
├── name
├── email
├── password
├── email_verified_at
├── remember_token
├── created_at
└── updated_at

-- Biens immobiliers
properties
├── id
├── user_id (FK → users)
├── name
├── type (enum: apartment, house, commercial, parking)
├── address
├── city
├── postal_code
├── surface_area
├── rooms
├── bedrooms
├── bathrooms
├── description
├── monthly_rent
├── charges
├── deposit
├── status (enum: available, rented, maintenance)
├── created_at
└── updated_at

-- Photos de biens
property_photos
├── id
├── property_id (FK → properties)
├── file_path
├── is_main
├── created_at
└── updated_at

-- Locataires
tenants
├── id
├── user_id (FK → users)
├── first_name
├── last_name
├── email
├── phone
├── birth_date
├── nationality
├── id_card_number
├── profession
├── created_at
└── updated_at

-- Baux
leases
├── id
├── property_id (FK → properties)
├── tenant_id (FK → tenants)
├── start_date
├── end_date
├── monthly_rent
├── charges
├── deposit
├── rent_day (1-31)
├── status (enum: active, terminated, pending)
├── created_at
└── updated_at

-- Loyers
rents
├── id
├── lease_id (FK → leases)
├── period_month (1-12)
├── period_year
├── amount
├── charges
├── total_amount
├── due_date
├── paid_date
├── status (enum: pending, paid, late, partial)
├── payment_method
├── created_at
└── updated_at

-- Paiements de loyers
rent_payments
├── id
├── rent_id (FK → rents)
├── amount
├── payment_date
├── payment_method
├── reference
├── notes
├── created_at
└── updated_at

-- Charges
charges
├── id
├── lease_id (FK → leases)
├── type (enum: water, electricity, maintenance, etc.)
├── amount
├── period_month
├── period_year
├── created_at
└── updated_at

-- Dépenses
expenses
├── id
├── property_id (FK → properties)
├── category (enum: repair, tax, insurance, etc.)
├── amount
├── description
├── expense_date
├── receipt_path
├── created_at
└── updated_at

-- Documents
documents
├── id
├── documentable_type (Property, Tenant, Lease)
├── documentable_id
├── type (enum: lease, receipt, inventory, insurance)
├── name
├── file_path
├── created_at
└── updated_at
```

---

## 🚀 Commandes de Démarrage

### Backend (Laravel)

```bash
cd backend

# Démarrer le serveur de développement
php artisan serve

# Lancer les migrations
php artisan migrate

# Lancer les seeders
php artisan db:seed

# Générer les models avec relations
php artisan make:model Property -mf
```

### Frontend (React)

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour production
npm run build
```

---

## 📦 Packages Installés

### Backend
- ✅ Laravel 11
- ✅ Laravel Sanctum (authentification API)
- ⏳ Spatie Laravel Permission (rôles & permissions)
- ⏳ Maatwebsite Excel (exports Excel)
- ⏳ Barryvdh DomPDF (génération PDF)
- ⏳ Intervention Image (manipulation d'images)

### Frontend
- ✅ React 18
- ✅ TypeScript
- ✅ Vite
- ✅ TailwindCSS
- ✅ Axios
- ✅ Zustand (state management)
- ✅ TanStack Query (React Query)
- ✅ React Hook Form + Zod
- ✅ Recharts (graphiques)
- ✅ date-fns (manipulation de dates)
- ✅ Lucide React (icônes)

---

## ⚙️ Configuration Requise

### Actions Manuelles Nécessaires

1. **Activer l'extension PHP mbstring**
   - Ouvrir `C:\xampp\php\php.ini`
   - Chercher `;extension=mbstring`
   - Décommenter en supprimant le `;`
   - Redémarrer Apache

2. **Démarrer MySQL**
   - Ouvrir le panneau de contrôle XAMPP
   - Cliquer sur "Start" pour MySQL
   - Créer la base de données `locagest_db`

3. **Configuration des URLs**
   - Backend API : `http://localhost:8000`
   - Frontend : `http://localhost:5173`

---

## 📝 Prochaines Étapes

### Phase 1 : Setup Backend
- [ ] Terminer l'installation des packages Laravel
- [ ] Créer toutes les migrations
- [ ] Créer les Models avec relations
- [ ] Créer les seeders de test
- [ ] Configurer Laravel Sanctum

### Phase 2 : API Backend
- [ ] Créer les Controllers API
- [ ] Créer les Form Requests (validation)
- [ ] Créer les Resources (transformation données)
- [ ] Implémenter l'authentification
- [ ] Tester les endpoints

### Phase 3 : Frontend Base
- [ ] Créer le système de routing
- [ ] Créer les composants UI de base
- [ ] Implémenter l'authentification frontend
- [ ] Créer le layout principal

### Phase 4 : Modules Métier
- [ ] Module Propriétés
- [ ] Module Locataires
- [ ] Module Baux
- [ ] Module Finances

---

## 🔐 Sécurité

- CORS configuré pour localhost
- Authentification via Laravel Sanctum
- Validation des données côté backend
- Protection CSRF
- Hachage des mots de passe (bcrypt)
- Limitation des requêtes (rate limiting)

---

## 📊 Performances

- Cache Redis (à configurer)
- Eager loading des relations
- Pagination des listes
- Lazy loading des images
- Optimisation des requêtes SQL

---

*Document généré le 8 octobre 2025*
