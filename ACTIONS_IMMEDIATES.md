# ⚠️ ACTIONS IMMÉDIATES REQUISES

## 🎯 Avant de Continuer le Développement

Le projet est initialisé mais nécessite **2 actions manuelles obligatoires** avant de pouvoir fonctionner.

---

## ✅ Action 1 : Activer l'extension PHP mbstring

### Pourquoi ?
Laravel nécessite l'extension `mbstring` pour fonctionner correctement. Sans elle, Composer ne peut pas installer les packages.

### Comment faire ?

1. **Ouvrir le fichier de configuration PHP**
   ```
   Localisation : C:\xampp\php\php.ini
   ```

2. **Trouver la ligne suivante** (vers la ligne 900-1000)
   ```ini
   ;extension=mbstring
   ```

3. **Supprimer le point-virgule** pour décommenter
   ```ini
   extension=mbstring
   ```

4. **Sauvegarder le fichier**

5. **Redémarrer Apache dans XAMPP**
   - Ouvrir le panneau de contrôle XAMPP
   - Cliquer sur "Stop" pour Apache
   - Attendre 2 secondes
   - Cliquer sur "Start" pour Apache

### Vérification

```bash
php -m | grep mbstring
```

Si tout est OK, vous devriez voir "mbstring" s'afficher.

---

## ✅ Action 2 : Démarrer MySQL et Créer la Base de Données

### Pourquoi ?
L'application nécessite une base de données MySQL pour stocker toutes les données (propriétés, locataires, baux, etc.).

### Comment faire ?

1. **Démarrer MySQL dans XAMPP**
   - Ouvrir le panneau de contrôle XAMPP
   - Cliquer sur "Start" pour MySQL
   - Vérifier que le statut affiche "Running" en vert

2. **Créer la base de données**

   **Option A : Via phpMyAdmin (Recommandé pour débutants)**
   ```
   1. Ouvrir http://localhost/phpmyadmin dans votre navigateur
   2. Cliquer sur "Nouvelle base de données" (ou "New")
   3. Nom : locagest_db
   4. Interclassement : utf8mb4_unicode_ci
   5. Cliquer sur "Créer"
   ```

   **Option B : Via ligne de commande**
   ```bash
   C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE IF NOT EXISTS locagest_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
   ```

### Vérification

Ouvrir phpMyAdmin, vous devriez voir `locagest_db` dans la liste des bases de données.

---

## 🚀 Après Avoir Terminé les 2 Actions

Une fois mbstring activé et MySQL démarré, exécutez ces commandes :

```bash
# 1. Aller dans le dossier backend
cd backend

# 2. Installer/Finaliser les packages Laravel
composer install

# 3. Lancer les migrations (créer les tables)
php artisan migrate

# 4. (Optionnel) Créer des données de test
php artisan db:seed

# 5. Démarrer le serveur Laravel
php artisan serve
```

Le backend sera accessible sur : **http://localhost:8000**

---

## 🎨 Démarrer le Frontend

Dans un **nouveau terminal** :

```bash
# 1. Aller dans le dossier frontend
cd frontend

# 2. Installer les dépendances (déjà fait normalement)
npm install

# 3. Démarrer le serveur de développement
npm run dev
```

Le frontend sera accessible sur : **http://localhost:5173**

---

## 📊 Résumé des URLs

| Service | URL | Statut |
|---------|-----|--------|
| Frontend React | http://localhost:5173 | ⏳ Après `npm run dev` |
| Backend API | http://localhost:8000 | ⏳ Après `php artisan serve` |
| phpMyAdmin | http://localhost/phpmyadmin | ✅ Disponible maintenant |
| XAMPP Dashboard | http://localhost | ✅ Disponible maintenant |

---

## ❓ En Cas de Problème

### Problème 1 : "mbstring not found" après modification

**Solution :**
- Vérifiez que vous avez bien sauvegardé le fichier php.ini
- Vérifiez que vous avez redémarré Apache
- Vérifiez que vous modifiez le bon php.ini (il peut y en avoir plusieurs)

Pour trouver le bon fichier :
```bash
php --ini
```

### Problème 2 : MySQL ne démarre pas

**Solutions possibles :**
1. Le port 3306 est peut-être utilisé par un autre programme
2. Vérifier les logs dans XAMPP : cliquer sur "Logs" à côté de MySQL
3. Essayer de changer le port dans la configuration XAMPP

### Problème 3 : "composer install" échoue

**Solution :**
- S'assurer que mbstring est bien activé (voir Problème 1)
- Vérifier votre connexion internet
- Essayer : `composer install --ignore-platform-reqs` (temporaire)

### Problème 4 : "npm install" échoue

**Solution :**
- Vérifier votre connexion internet
- Nettoyer le cache npm : `npm cache clean --force`
- Supprimer le dossier node_modules et package-lock.json, puis réessayer

---

## 📞 Besoin d'Aide ?

Consultez les fichiers suivants pour plus d'informations :
- [README.md](README.md) - Vue d'ensemble du projet
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Structure détaillée
- [NEXT_STEPS.md](NEXT_STEPS.md) - Prochaines étapes de développement

---

## ✨ Une Fois Tout Configuré

Vous pourrez commencer le développement en suivant les étapes dans [NEXT_STEPS.md](NEXT_STEPS.md) :

1. Créer les migrations de base de données
2. Créer les models Laravel
3. Créer les controllers API
4. Développer les pages React
5. Et bien plus !

---

**Bon courage ! Le plus dur est fait, il ne reste que 2 petites actions manuelles ! 💪**
