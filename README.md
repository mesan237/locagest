# 🏠 Locagest Pro - SaaS de Gestion Locative

Plateforme complète de gestion locative pour propriétaires et gestionnaires immobiliers, développée avec Laravel 11 et React 18.

---

## 🎯 Fonctionnalités Principales

### 📊 Tableau de Bord
- Vue d'ensemble des statistiques clés
- Taux d'occupation des biens
- Revenus mensuels et annuels
- Alertes et notifications importantes
- Graphiques de performance

### 🏢 Gestion des Biens
- CRUD complet des propriétés
- Upload et gestion de photos
- Caractéristiques détaillées (surface, pièces, etc.)
- Géolocalisation des biens
- Documents associés
- Historique des locations

### 👥 Gestion des Locataires
- Profils complets des locataires
- Documents d'identité et justificatifs
- Historique de location
- Garants et co-locataires
- Communication intégrée

### 📝 Contrats de Bail
- Création et édition de baux
- Templates personnalisables
- États des lieux (entrée/sortie)
- Renouvellements automatiques
- Avenants et modifications
- Signatures électroniques

### 💰 Finances et Comptabilité
- Échéancier automatique des loyers
- Génération de quittances
- Suivi des paiements
- Gestion des impayés
- Appels de loyer automatiques
- Gestion des charges
- Rapprochement bancaire
- Comptabilité par bien

### 📄 Documents
- Génération automatique de PDF
- Templates personnalisables
- Stockage sécurisé
- Archive numérique complète
- Signature électronique

### 📈 Déclarations Fiscales
- Pré-remplissage des revenus fonciers
- Calcul automatique des charges déductibles
- Exports comptables
- Rapports annuels

### 🔔 Notifications
- Emails automatiques
- SMS (optionnel)
- Rappels de paiement
- Alertes d'échéances
- Messagerie intégrée

---

## 🛠️ Technologies Utilisées

### Backend
- **Framework**: Laravel 11
- **Base de données**: MySQL 8.0+
- **Authentification**: Laravel Sanctum
- **Cache**: Redis (optionnel)
- **PDF**: DomPDF
- **Excel**: Maatwebsite Excel
- **Images**: Intervention Image
- **Permissions**: Spatie Laravel Permission

### Frontend
- **Framework**: React 18
- **Langage**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Dates**: date-fns

---

## ⚙️ Installation

### Prérequis

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- MySQL 8.0+ ou PostgreSQL 15+
- XAMPP (pour Windows) ou serveur web

### Étape 1 : Configuration XAMPP

1. **Activer l'extension mbstring**
   ```
   - Ouvrir C:\xampp\php\php.ini
   - Chercher ;extension=mbstring
   - Supprimer le point-virgule pour décommenter
   - Sauvegarder
   ```

2. **Démarrer les services**
   ```
   - Ouvrir le panneau de contrôle XAMPP
   - Démarrer Apache
   - Démarrer MySQL
   ```

3. **Créer la base de données**
   ```bash
   # Via phpMyAdmin (http://localhost/phpmyadmin)
   # Ou via ligne de commande :
   C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE locagest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

### Étape 2 : Configuration Backend

```bash
cd backend

# Installer les dépendances
composer install

# Copier le fichier .env (déjà fait)
# Vérifier la configuration dans .env

# Générer la clé d'application (déjà fait)
# php artisan key:generate

# Lancer les migrations
php artisan migrate

# Lancer les seeders (optionnel, pour données de test)
php artisan db:seed

# Démarrer le serveur
php artisan serve
```

Le backend sera accessible sur `http://localhost:8000`

### Étape 3 : Configuration Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

---

## 📁 Structure du Projet

```
locagest/
├── backend/              # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── ...
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
├── frontend/             # Application React
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── types/
│   └── package.json
├── docs/                 # Documentation
├── PROJECT_STRUCTURE.md  # Documentation détaillée
└── README.md            # Ce fichier
```

Voir [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) pour la structure complète détaillée.

---

## 🚀 Utilisation

### Démarrage Rapide

1. **Démarrer le backend**
   ```bash
   cd backend
   php artisan serve
   ```

2. **Démarrer le frontend** (dans un nouveau terminal)
   ```bash
   cd frontend
   npm run dev
   ```

3. **Accéder à l'application**
   - Frontend : http://localhost:5173
   - API : http://localhost:8000/api

---

## 🔧 Configuration

### Variables d'Environnement Backend (.env)

```env
APP_NAME="Locagest Pro"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=locagest_db
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
```

### Variables d'Environnement Frontend (.env)

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Locagest Pro
```

---

## 📝 Développement

### Commandes Utiles Backend

```bash
# Créer une migration
php artisan make:migration create_table_name

# Créer un modèle avec migration et factory
php artisan make:model ModelName -mf

# Créer un controller
php artisan make:controller Api/ControllerName --api

# Créer une requête de validation
php artisan make:request StorePropertyRequest

# Créer une resource
php artisan make:resource PropertyResource

# Nettoyer le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

### Commandes Utiles Frontend

```bash
# Installer un nouveau package
npm install package-name

# Lancer les tests (à configurer)
npm run test

# Build de production
npm run build

# Preview du build
npm run preview

# Linter
npm run lint
```

---

## 📊 Roadmap

### Phase 1 : Fondations (Actuelle) ✅
- [x] Setup initial du projet
- [x] Configuration Laravel + React
- [x] Structure des dossiers
- [x] Documentation de base
- [ ] Activer mbstring (action manuelle)
- [ ] Finaliser installation packages Laravel

### Phase 2 : Backend Core
- [ ] Migrations de base de données
- [ ] Models et relations
- [ ] Seeders
- [ ] Authentification API
- [ ] Controllers de base

### Phase 3 : Frontend Core
- [ ] Routing
- [ ] Composants UI de base
- [ ] Layout principal
- [ ] Authentification

### Phase 4 : Modules Fonctionnels
- [ ] Module Propriétés
- [ ] Module Locataires
- [ ] Module Baux
- [ ] Module Finances

### Phase 5 : Fonctionnalités Avancées
- [ ] Génération de documents PDF
- [ ] Système de notifications
- [ ] Dashboard avec graphiques
- [ ] Exports Excel

### Phase 6 : Optimisation
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Optimisation performances
- [ ] Sécurité renforcée

### Phase 7 : Déploiement
- [ ] Configuration serveur production
- [ ] CI/CD
- [ ] Monitoring
- [ ] Documentation utilisateur

---

## 🤝 Contribution

Ce projet est en développement actif.

---

## 📄 Licence

Projet privé - Tous droits réservés

---

## 👤 Auteur

Développé avec l'assistance de Claude Code

---

## 📞 Support

Pour toute question ou problème, consultez la documentation dans `/docs` ou le fichier `PROJECT_STRUCTURE.md`.

---

## ⚠️ Actions Requises

### IMPORTANT : Configuration Manuelle

Avant de pouvoir utiliser l'application, vous devez effectuer ces actions manuelles :

1. ✅ **Activer l'extension mbstring**
   - Localisation : `C:\xampp\php\php.ini`
   - Action : Décommenter `extension=mbstring`
   - Redémarrer Apache après modification

2. ✅ **Démarrer MySQL**
   - Ouvrir le panneau XAMPP
   - Cliquer sur "Start" pour MySQL
   - Créer la base de données `locagest_db`

3. ✅ **Finaliser les packages Laravel**
   ```bash
   cd backend
   composer install
   ```

---

**Bon développement ! 🚀**
