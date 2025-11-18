# Plan de Développement - 2 Semaines
## Locagest Pro - Planning Frontend & Backend

**Période:** 18 Novembre - 1er Décembre 2025
**Équipe:** 2 développeurs (Backend + Frontend)
**Objectif:** Livrer un MVP fonctionnel avec les modules principaux

---

## Vue d'Ensemble

### Objectifs du Sprint
- ✅ Base de données migrée et optimisée
- ✅ Authentification complète (Backend + Frontend)
- ✅ CRUD Propriétés avec photos
- ✅ CRUD Locataires
- ✅ Gestion des Baux
- ✅ Suivi des Loyers et Paiements
- ✅ Dashboard avec statistiques

### Technologies
**Backend:** Laravel 12, Sanctum, MySQL
**Frontend:** React 18, TypeScript, TailwindCSS, Zustand, React Query

---

## SEMAINE 1 : Foundation & Core Features

### 📅 Jour 1 - Lundi 18 Nov (Setup & Auth)

#### Backend Developer
**Temps: 6-8h**

- [x] ✅ Migrations créées et exécutées
- [ ] **Créer les Models avec relations** (2h)
  ```bash
  # Dans backend/app/Models/
  - Property.php (relations: user, photos, leases, expenses)
  - PropertyPhoto.php
  - Tenant.php (relations: user, leases)
  - Lease.php (relations: property, tenant, rents, cotenants, guarantors)
  - Rent.php (relations: lease, payments)
  - RentPayment.php
  - Expense.php
  - Document.php (polymorphic)
  - Plan.php
  - Subscription.php
  ```

- [ ] **Configurer Laravel Sanctum** (1h)
  ```bash
  php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
  # Configurer CORS dans config/cors.php
  # Ajouter middleware Sanctum dans api.php
  ```

- [ ] **Créer AuthController** (2h)
  ```php
  // backend/app/Http/Controllers/Api/AuthController.php
  - register() - Inscription utilisateur
  - login() - Connexion + token Sanctum
  - logout() - Révocation token
  - me() - User actuel
  - updateProfile() - MAJ profil
  ```

- [ ] **Créer les Form Requests** (1h)
  ```bash
  php artisan make:request Auth/RegisterRequest
  php artisan make:request Auth/LoginRequest
  php artisan make:request Auth/UpdateProfileRequest
  ```

- [ ] **Tester les endpoints Auth avec Postman/Insomnia** (1h)

**Livrables:**
- ✅ BDD migrée
- ✅ Models avec relations
- ✅ API Auth fonctionnelle
- ✅ Documentation Postman

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Setup projet React** (1h)
  ```bash
  cd frontend
  npm install
  # Vérifier packages: axios, zustand, @tanstack/react-query, react-router-dom
  ```

- [ ] **Configurer Axios client** (1h)
  ```typescript
  // src/api/client.ts
  - Instance Axios avec baseURL
  - Intercepteurs (auth token, erreurs)
  - Type-safe requests
  ```

- [ ] **Créer Store Zustand Auth** (1h)
  ```typescript
  // src/stores/authStore.ts
  - State: user, token, isAuthenticated
  - Actions: login, logout, register, updateUser
  - Persist token dans localStorage
  ```

- [ ] **Créer composants UI de base** (2h)
  ```typescript
  // src/components/ui/
  - Button.tsx
  - Input.tsx
  - Card.tsx
  - Alert.tsx
  - Spinner.tsx
  ```

- [ ] **Créer pages Auth** (3h)
  ```typescript
  // src/pages/auth/
  - Login.tsx (formulaire avec validation)
  - Register.tsx (formulaire complet)

  // src/components/features/auth/
  - LoginForm.tsx
  - RegisterForm.tsx
  ```

**Livrables:**
- ✅ Setup React complet
- ✅ Composants UI de base
- ✅ Pages Login/Register fonctionnelles
- ✅ Store Auth opérationnel

---

### 📅 Jour 2 - Mardi 19 Nov (Dashboard & Layout)

#### Backend Developer
**Temps: 6-8h**

- [ ] **Créer DashboardController** (2h)
  ```php
  // app/Http/Controllers/Api/DashboardController.php
  - stats() - Statistiques globales
    * Nombre total de propriétés
    * Nombre de biens loués/disponibles
    * Nombre de locataires actifs
    * Loyers en attente ce mois
    * Revenus du mois
    * Taux d'occupation
  ```

- [ ] **Créer les Seeders** (2h)
  ```bash
  php artisan make:seeder PlanSeeder
  php artisan make:seeder UserSeeder
  php artisan make:seeder PropertySeeder
  php artisan make:seeder TenantSeeder

  # Créer données de test réalistes
  ```

- [ ] **Créer PropertyController (base)** (2h)
  ```php
  // app/Http/Controllers/Api/PropertyController.php
  - index() - Liste avec filtres et pagination
  - store() - Création
  - show() - Détails
  - update() - Modification
  - destroy() - Suppression (soft delete)
  ```

- [ ] **Tests API Dashboard et Properties** (1h)

**Livrables:**
- ✅ API Dashboard avec stats
- ✅ Seeders fonctionnels
- ✅ CRUD Properties (base)

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Créer Layout principal** (2h)
  ```typescript
  // src/components/layout/
  - AppLayout.tsx (structure générale)
  - Sidebar.tsx (navigation)
  - Header.tsx (user menu, notifications)
  - Footer.tsx
  ```

- [ ] **Créer système de routing** (1h)
  ```typescript
  // src/App.tsx
  - React Router v6
  - Routes protégées (PrivateRoute)
  - Routes publiques (auth)
  - Lazy loading
  ```

- [ ] **Créer page Dashboard** (3h)
  ```typescript
  // src/pages/dashboard/Dashboard.tsx
  - Cartes statistiques (StatsCard)
  - Graphiques (Recharts)
  - Liste activités récentes
  - Loyers en attente

  // src/components/features/dashboard/
  - StatsCard.tsx
  - RecentActivity.tsx
  - UpcomingRents.tsx
  ```

- [ ] **Hook React Query pour Dashboard** (1h)
  ```typescript
  // src/hooks/useDashboard.ts
  - Fetch stats
  - Auto-refresh
  - Cache management
  ```

**Livrables:**
- ✅ Layout complet et responsive
- ✅ Dashboard avec statistiques
- ✅ Navigation fonctionnelle

---

### 📅 Jour 3 - Mercredi 20 Nov (Module Propriétés)

#### Backend Developer
**Temps: 6-8h**

- [ ] **Compléter PropertyController** (2h)
  ```php
  - uploadPhotos() - Upload multiple photos
  - deletePhoto() - Supprimer une photo
  - setMainPhoto() - Définir photo principale
  - filters() - Filtres avancés (ville, type, status)
  ```

- [ ] **Créer PropertyService** (2h)
  ```php
  // app/Services/PropertyService.php
  - Logique métier complexe
  - Génération référence unique (REF-2024-001)
  - Calcul rentabilité
  - Upload et resize photos (Intervention Image)
  ```

- [ ] **Créer PropertyResource** (1h)
  ```php
  // app/Http/Resources/PropertyResource.php
  - Transformation JSON API
  - Include photos, leases, status
  ```

- [ ] **Form Requests Properties** (1h)
  ```bash
  php artisan make:request Property/StorePropertyRequest
  php artisan make:request Property/UpdatePropertyRequest
  # Validation complète
  ```

- [ ] **Tests complets Properties** (1h)

**Livrables:**
- ✅ CRUD Properties complet
- ✅ Upload photos fonctionnel
- ✅ Filtres et recherche

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Créer API Properties** (1h)
  ```typescript
  // src/api/properties.ts
  - getProperties(filters)
  - getProperty(id)
  - createProperty(data)
  - updateProperty(id, data)
  - deleteProperty(id)
  - uploadPhotos(id, files)
  ```

- [ ] **Créer composants Properties** (3h)
  ```typescript
  // src/components/features/properties/
  - PropertyCard.tsx (carte avec photo)
  - PropertyList.tsx (grille/liste)
  - PropertyFilters.tsx (filtres avancés)
  - PropertyForm.tsx (formulaire création/édition)
  - PhotoUploader.tsx (drag & drop)
  ```

- [ ] **Créer pages Properties** (2h)
  ```typescript
  // src/pages/properties/
  - PropertiesPage.tsx (liste avec filtres)
  - PropertyDetails.tsx (détails complets)
  - CreateProperty.tsx (formulaire création)
  ```

- [ ] **Hook useProperties** (1h)
  ```typescript
  // src/hooks/useProperties.ts
  - React Query hooks
  - Mutations (create, update, delete)
  - Optimistic updates
  ```

**Livrables:**
- ✅ Page liste propriétés
- ✅ Formulaire création/édition
- ✅ Upload photos drag & drop
- ✅ Filtres fonctionnels

---

### 📅 Jour 4 - Jeudi 21 Nov (Module Locataires)

#### Backend Developer
**Temps: 6-8h**

- [ ] **Créer TenantController** (2h)
  ```php
  // app/Http/Controllers/Api/TenantController.php
  - index() - Liste avec recherche
  - store() - Création
  - show() - Détails + baux actifs
  - update() - Modification
  - destroy() - Soft delete
  - uploadDocument() - Upload pièces identité
  ```

- [ ] **Créer TenantService** (1h)
  ```php
  // app/Services/TenantService.php
  - Validation solvabilité (revenu vs loyer)
  - Calcul âge
  - Vérification documents requis
  ```

- [ ] **Form Requests Tenants** (1h)
  ```bash
  php artisan make:request Tenant/StoreTenantRequest
  php artisan make:request Tenant/UpdateTenantRequest
  ```

- [ ] **TenantResource** (1h)
  ```php
  // Include leases, documents, guarantors
  ```

- [ ] **Tests Tenants** (1h)

**Livrables:**
- ✅ CRUD Tenants complet
- ✅ Upload documents
- ✅ Validation solvabilité

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Créer API Tenants** (1h)
  ```typescript
  // src/api/tenants.ts
  ```

- [ ] **Composants Tenants** (3h)
  ```typescript
  // src/components/features/tenants/
  - TenantCard.tsx (fiche résumé)
  - TenantList.tsx
  - TenantForm.tsx (formulaire complet)
  - TenantSearch.tsx (recherche avec autocomplete)
  - DocumentUpload.tsx (CNI, justificatifs)
  ```

- [ ] **Pages Tenants** (2h)
  ```typescript
  // src/pages/tenants/
  - TenantsPage.tsx
  - TenantDetails.tsx (+ historique baux)
  - CreateTenant.tsx
  ```

- [ ] **Hook useTenants** (1h)

**Livrables:**
- ✅ Gestion complète locataires
- ✅ Formulaire avec validation
- ✅ Upload documents

---

### 📅 Jour 5 - Vendredi 22 Nov (Module Baux - Partie 1)

#### Backend Developer
**Temps: 6-8h**

- [ ] **Créer LeaseController** (3h)
  ```php
  // app/Http/Controllers/Api/LeaseController.php
  - index() - Liste baux avec filtres
  - store() - Création bail
  - show() - Détails complets
  - update() - Modification
  - terminate() - Résiliation bail
  - addCotenant() - Ajouter co-locataire
  - addGuarantor() - Ajouter garant
  ```

- [ ] **Créer LeaseService** (2h)
  ```php
  // app/Services/LeaseService.php
  - Génération référence (BAIL-2024-001)
  - Validation dates
  - Calcul loyer avec révision IRL
  - Génération automatique des loyers mensuels
  - Vérification propriété disponible
  ```

- [ ] **LeaseObserver** (1h)
  ```php
  // app/Observers/LeaseObserver.php
  - created() - Générer loyers automatiquement
  - updated() - MAJ statut propriété
  - terminated() - Libérer propriété
  ```

- [ ] **Form Requests Leases** (1h)

**Livrables:**
- ✅ CRUD Baux
- ✅ Gestion co-locataires/garants
- ✅ Observer pour logique métier

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Créer API Leases** (1h)

- [ ] **Composants Leases (Partie 1)** (3h)
  ```typescript
  // src/components/features/leases/
  - LeaseCard.tsx
  - LeaseForm.tsx (étape 1: infos générales)
  - PropertySelector.tsx (sélection bien)
  - TenantSelector.tsx (sélection locataire)
  ```

- [ ] **Pages Leases** (2h)
  ```typescript
  // src/pages/leases/
  - LeasesPage.tsx (liste)
  - CreateLease.tsx (formulaire multi-étapes)
  ```

- [ ] **Hook useLeases** (1h)

**Livrables:**
- ✅ Liste baux
- ✅ Formulaire création (base)

---

## SEMAINE 2 : Advanced Features & Polish

### 📅 Jour 6 - Lundi 25 Nov (Module Baux - Partie 2)

#### Backend Developer
**Temps: 6-8h**

- [ ] **Créer RentController** (3h)
  ```php
  // app/Http/Controllers/Api/RentController.php
  - index() - Liste loyers par bail
  - recordPayment() - Enregistrer paiement
  - generateReceipt() - Générer quittance PDF
  - sendReminder() - Relance locataire
  - calculateLate() - Calcul retards
  ```

- [ ] **Créer RentService** (2h)
  ```php
  // app/Services/RentService.php
  - Génération loyers mensuels
  - Calcul solde restant
  - Logique paiements partiels
  - MAJ statut (pending, paid, late)
  ```

- [ ] **Job GenerateMonthlyRents** (1h)
  ```php
  // app/Jobs/GenerateMonthlyRents.php
  - Générer loyers du mois pour tous les baux actifs
  - Planifier avec Scheduler (1er du mois)
  ```

- [ ] **Tests Rents** (1h)

**Livrables:**
- ✅ Gestion loyers complète
- ✅ Enregistrement paiements
- ✅ Job génération automatique

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Compléter LeaseForm** (2h)
  ```typescript
  // Multi-step form
  - Étape 2: Co-locataires
  - Étape 3: Garants
  - Étape 4: Récapitulatif
  ```

- [ ] **Composants Leases (Partie 2)** (2h)
  ```typescript
  // src/components/features/leases/
  - LeaseDetails.tsx (vue complète)
  - CotenantsList.tsx
  - GuarantorsList.tsx
  - LeaseTimeline.tsx (historique)
  ```

- [ ] **Page LeaseDetails** (2h)
  ```typescript
  // src/pages/leases/LeaseDetails.tsx
  - Onglets: Infos, Loyers, Documents
  - Actions: Modifier, Résilier
  ```

**Livrables:**
- ✅ Formulaire bail complet
- ✅ Page détails bail
- ✅ Gestion co-locataires/garants

---

### 📅 Jour 7 - Mardi 26 Nov (Module Finances)

#### Backend Developer
**Temps: 6-8h**

- [ ] **Créer ExpenseController** (2h)
  ```php
  // app/Http/Controllers/Api/ExpenseController.php
  - CRUD complet
  - uploadInvoice() - Upload facture
  - analytics() - Stats dépenses
  ```

- [ ] **Créer FinanceController** (2h)
  ```php
  // app/Http/Controllers/Api/FinanceController.php
  - overview() - Vue d'ensemble financière
  - rentalsIncome() - Revenus locatifs
  - expenses() - Dépenses par catégorie
  - profitability() - Rentabilité par bien
  - exportExcel() - Export comptable
  ```

- [ ] **Créer DocumentGeneratorService** (2h)
  ```php
  // app/Services/DocumentGeneratorService.php
  - generateReceipt() - Quittance de loyer (PDF)
  - generateLeaseContract() - Contrat de bail
  - generateInventory() - État des lieux
  # Utiliser DomPDF
  ```

- [ ] **Tests Finances** (1h)

**Livrables:**
- ✅ Gestion dépenses
- ✅ Analytics financières
- ✅ Génération PDF

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Créer API Rents & Finances** (1h)
  ```typescript
  // src/api/rents.ts
  // src/api/finances.ts
  ```

- [ ] **Composants Finances** (3h)
  ```typescript
  // src/components/features/finances/
  - RentCalendar.tsx (calendrier loyers)
  - PaymentForm.tsx (enregistrer paiement)
  - FinanceChart.tsx (graphiques revenus/dépenses)
  - ExpensesList.tsx
  - ExpenseForm.tsx
  ```

- [ ] **Pages Finances** (2h)
  ```typescript
  // src/pages/finances/
  - RentsPage.tsx (tous les loyers)
  - ExpensesPage.tsx (dépenses)
  - FinancialOverview.tsx (vue globale)
  ```

- [ ] **Hooks Finances** (1h)

**Livrables:**
- ✅ Calendrier loyers
- ✅ Formulaire paiement
- ✅ Graphiques financiers
- ✅ Gestion dépenses

---

### 📅 Jour 8 - Mercredi 27 Nov (Module Documents & Notifications)

#### Backend Developer
**Temps: 6-8h**

- [ ] **Créer DocumentController** (2h)
  ```php
  // app/Http/Controllers/Api/DocumentController.php
  - CRUD avec polymorphic relations
  - upload() - Upload document
  - download() - Téléchargement
  - sign() - Signature électronique (base)
  ```

- [ ] **Créer NotificationController** (1h)
  ```php
  // app/Http/Controllers/Api/NotificationController.php
  - index() - Liste notifications
  - markAsRead() - Marquer lu
  - markAllAsRead()
  ```

- [ ] **Créer NotificationService** (2h)
  ```php
  // app/Services/NotificationService.php
  - Créer notifications système
  - Logique d'envoi
  ```

- [ ] **Jobs & Notifications** (2h)
  ```php
  // app/Jobs/
  - SendRentReminders.php (rappels loyers)
  - CheckLeaseExpiring.php (baux expirant)
  - CheckDocumentExpiring.php (docs à renouveler)

  // app/Notifications/
  - RentDueNotification.php
  - LeaseExpiringNotification.php
  ```

**Livrables:**
- ✅ Gestion documents
- ✅ Système notifications
- ✅ Jobs automatiques

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Composants Documents** (2h)
  ```typescript
  // src/components/features/documents/
  - DocumentList.tsx
  - DocumentUpload.tsx
  - DocumentViewer.tsx
  ```

- [ ] **Composants Notifications** (2h)
  ```typescript
  // src/components/features/notifications/
  - NotificationBell.tsx (header)
  - NotificationList.tsx
  - NotificationItem.tsx
  ```

- [ ] **Pages Documents** (1h)
  ```typescript
  // src/pages/documents/DocumentsPage.tsx
  ```

- [ ] **Intégrer notifications dans Header** (1h)
  ```typescript
  // Badge avec nombre non lus
  // Dropdown notifications
  // Auto-refresh
  ```

- [ ] **Amélioration UX globale** (1h)
  - Loading states
  - Error handling
  - Toast notifications
  - Confirmations

**Livrables:**
- ✅ Gestion documents
- ✅ Notifications temps réel
- ✅ UX améliorée

---

### 📅 Jour 9 - Jeudi 28 Nov (États des Lieux)

#### Backend Developer
**Temps: 6-8h**

- [ ] **Créer InventoryController** (3h)
  ```php
  // app/Http/Controllers/Api/InventoryController.php
  - createCheckIn() - État des lieux entrée
  - createCheckOut() - État des lieux sortie
  - addItem() - Ajouter item
  - updateItem() - MAJ item
  - generatePDF() - PDF état des lieux
  - compare() - Comparer entrée/sortie
  ```

- [ ] **Créer InventoryService** (2h)
  ```php
  // app/Services/InventoryService.php
  - Template état des lieux par défaut
  - Comparaison entrée/sortie
  - Calcul retenues caution
  ```

- [ ] **Tests Inventory** (1h)

**Livrables:**
- ✅ Gestion états des lieux
- ✅ PDF génération
- ✅ Comparaison entrée/sortie

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Composants Inventory** (4h)
  ```typescript
  // src/components/features/inventory/
  - InventoryForm.tsx (formulaire complet)
  - InventoryRoomSection.tsx (par pièce)
  - InventoryItemRow.tsx (ligne item)
  - InventoryComparison.tsx (comparaison)
  - PhotoAnnotation.tsx (annoter photos)
  ```

- [ ] **Pages Inventory** (2h)
  ```typescript
  // src/pages/inventory/
  - CreateInventory.tsx
  - InventoryDetails.tsx
  - InventoryComparison.tsx
  ```

**Livrables:**
- ✅ Formulaire état des lieux
- ✅ Gestion par pièce/item
- ✅ Vue comparative

---

### 📅 Jour 10 - Vendredi 29 Nov (Polish & Tests)

#### Backend Developer
**Temps: 6-8h**

- [ ] **Finaliser Seeders** (2h)
  ```php
  // Données de démo complètes
  - 10 utilisateurs
  - 50 propriétés
  - 30 locataires
  - 40 baux (actifs/terminés)
  - 200 loyers
  - 100 paiements
  - 50 dépenses
  ```

- [ ] **Tests d'intégration** (2h)
  - Tests API complets
  - Tests relations
  - Tests permissions

- [ ] **Optimisations** (2h)
  - Eager loading
  - Index BDD
  - Cache queries
  - N+1 queries

- [ ] **Documentation API** (1h)
  - Postman Collection complète
  - README.md backend

**Livrables:**
- ✅ Seeders complets
- ✅ Tests passants
- ✅ Optimisations
- ✅ Documentation

---

#### Frontend Developer
**Temps: 6-8h**

- [ ] **Page Settings** (2h)
  ```typescript
  // src/pages/settings/SettingsPage.tsx
  - Profil utilisateur
  - Préférences
  - Notifications
  - Sécurité
  ```

- [ ] **Responsive Design** (2h)
  - Mobile optimization
  - Tablet views
  - Touch interactions

- [ ] **Tests Frontend** (1h)
  - Tests composants critiques
  - Tests hooks

- [ ] **Performance** (1h)
  - Code splitting
  - Lazy loading
  - Image optimization
  - Bundle analysis

- [ ] **Documentation Frontend** (1h)
  - README.md
  - Storybook (optionnel)

**Livrables:**
- ✅ Page settings
- ✅ Responsive complet
- ✅ Performance optimisée
- ✅ Documentation

---

## Points de Synchronisation Quotidiens

### Daily Standup (15 min)
**Horaire:** 9h00 chaque matin

**Format:**
1. Qu'ai-je fait hier ?
2. Que vais-je faire aujourd'hui ?
3. Y a-t-il des blocages ?

### Code Review
- Review croisée chaque fin de journée
- Utiliser GitHub Pull Requests
- Minimum 1 approbation avant merge

### Communication
- **Slack/Discord:** Messages rapides
- **GitHub Issues:** Bugs et features
- **Notion/Trello:** Suivi tâches (optionnel)

---

## Critères de Succès (DoD - Definition of Done)

### Pour chaque fonctionnalité :
- [ ] Code écrit et testé
- [ ] Tests unitaires/intégration (backend)
- [ ] Tests composants (frontend)
- [ ] Documentation à jour
- [ ] Code review approuvé
- [ ] Déployé sur environnement de dev
- [ ] Testé manuellement

### Pour le MVP (fin de 2 semaines) :
- [ ] Authentification complète
- [ ] CRUD complet (Properties, Tenants, Leases)
- [ ] Gestion loyers et paiements
- [ ] Dashboard fonctionnel
- [ ] Design responsive
- [ ] Performance acceptable (<2s chargement)
- [ ] Pas de bugs critiques
- [ ] Documentation complète

---

## Risques & Contingence

### Risques Identifiés

1. **Retard sur module Baux** (Probabilité: Moyenne)
   - **Impact:** Bloque module Loyers
   - **Mitigation:** Prioriser Baux, simplifier si nécessaire

2. **Complexité génération PDF** (Probabilité: Haute)
   - **Impact:** Retard sur documents
   - **Mitigation:** Utiliser templates simples, améliorer v2

3. **Intégration Frontend/Backend** (Probabilité: Faible)
   - **Impact:** Blocages communication
   - **Mitigation:** Tester endpoints en continu, mock data

### Buffer Time
- **1h par jour** réservé pour imprévus
- **Jour 10 après-midi** : Buffer général

---

## Commandes Utiles

### Backend
```bash
# Migrations
php artisan migrate:fresh --seed

# Créer Model
php artisan make:model Property -mfcr
# m=migration, f=factory, c=controller, r=resource

# Lancer serveur
php artisan serve

# Queues (pour jobs)
php artisan queue:work

# Tests
php artisan test
```

### Frontend
```bash
# Dev server
npm run dev

# Build
npm run build

# Preview build
npm run preview

# Linter
npm run lint
```

### Git Workflow
```bash
# Feature branch
git checkout -b feature/properties-module

# Commit
git add .
git commit -m "feat: add properties CRUD"

# Push
git push origin feature/properties-module

# Pull Request sur GitHub
```

---

## Ressources & Références

### Documentation
- [Laravel 12](https://laravel.com/docs/12.x)
- [React Query](https://tanstack.com/query/latest)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand)

### Design Inspiration
- [Buildium](https://www.buildium.com/) - Property management
- [Rentec Direct](https://www.rentecdirect.com/)
- [Propertyware](https://www.propertyware.com/)

### Outils
- **Postman** - Tests API
- **Figma** - Maquettes (si disponible)
- **VS Code** - IDE
- **TablePlus** - Client MySQL

---

## Prochaines Étapes (Post-MVP)

### Semaine 3-4 (Améliorations)
- [ ] Export Excel/PDF avancé
- [ ] Emails automatiques (SMTP)
- [ ] Système d'abonnements (Stripe)
- [ ] Multi-langues (i18n)
- [ ] Mode hors-ligne (PWA)
- [ ] Mobile app (React Native - optionnel)

### Features Futures
- [ ] Chatbot support
- [ ] Signature électronique
- [ ] Comptabilité avancée
- [ ] Rapport fiscal automatique
- [ ] API publique pour intégrations
- [ ] Marketplace services (artisans, assurances)

---

**Dernière mise à jour:** 17 Novembre 2025
**Version:** 1.0
**Auteurs:** Équipe Locagest Pro

---

## Notes de Session

*Utilisez cette section pour noter les décisions importantes prises pendant le développement*

**Exemple:**
```
[18 Nov] Décision: Utiliser DomPDF au lieu de Snappy PDF (plus simple)
[19 Nov] Problème résolu: CORS configuré pour localhost:5173
[20 Nov] Feature ajoutée: Auto-save formulaire properties
```
