# 🚀 Guide Rapide - Test de l'API Locagest Pro

**5 minutes pour tester l'API complète !**

---

## ⚡ Démarrage Rapide

### Étape 1 : Démarrer le Serveur

**Option A - Laragon (Recommandé)** :
1. Ouvrir Laragon
2. Cliquer "Start All"
3. URL : `http://locagest.test` ou `http://localhost`

**Option B - PHP Artisan** :
```bash
cd backend
php artisan serve
```
URL : `http://localhost:8000`

---

### Étape 2 : Vérifier la Base de Données

Dans Laragon, vérifier que MySQL est démarré (voyant vert).

**Vérifier les migrations :**
```bash
cd backend
php artisan migrate:status
```

Si migrations non exécutées :
```bash
php artisan migrate
```

---

### Étape 3 : Tester avec Postman

#### A. Importer la Collection

1. Ouvrir Postman
2. Cliquer "Import"
3. Sélectionner le fichier : `Locagest_API.postman_collection.json`
4. ✅ Collection "Locagest Pro API" importée

#### B. Configurer l'Environnement

1. Créer un nouvel environnement "Locagest Dev"
2. Ajouter la variable :
   - **Variable :** `base_url`
   - **Initial Value :** `http://localhost:8000` (ou votre URL)
   - **Current Value :** `http://localhost:8000`
3. Sauvegarder
4. Sélectionner cet environnement dans Postman

#### C. Tester les Endpoints (Dans l'ordre)

**1. Register (Inscription)**
- Ouvrir la requête "Register"
- Cliquer "Send"
- ✅ Réponse : 201 Created
- ✅ Token automatiquement sauvegardé dans l'environnement

**2. Login (Connexion)**
- Ouvrir la requête "Login"
- Cliquer "Send"
- ✅ Réponse : 200 OK
- ✅ Nouveau token sauvegardé

**3. Get Current User (Me)**
- Ouvrir la requête "Get Current User (Me)"
- Cliquer "Send"
- ✅ Réponse : 200 OK avec infos utilisateur

**4. Update Profile**
- Ouvrir la requête "Update Profile"
- Modifier les données si souhaité
- Cliquer "Send"
- ✅ Réponse : 200 OK

**5. Logout**
- Ouvrir la requête "Logout"
- Cliquer "Send"
- ✅ Réponse : 200 OK

---

## ✅ Checklist de Vérification

Cocher chaque test réussi :

- [ ] ✅ Serveur démarré (Laragon ou `php artisan serve`)
- [ ] ✅ MySQL actif
- [ ] ✅ Migrations exécutées
- [ ] ✅ Collection Postman importée
- [ ] ✅ Environnement configuré
- [ ] ✅ Register : 201 Created
- [ ] ✅ Login : 200 OK
- [ ] ✅ Get Me : 200 OK
- [ ] ✅ Update Profile : 200 OK
- [ ] ✅ Logout : 200 OK

**🎉 Si tous les tests passent, l'API fonctionne parfaitement !**

---

## 🐛 Problèmes Fréquents

### ❌ Erreur 404 - Route Not Found

**Solution :**
```bash
cd backend
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### ❌ Erreur 500 - Internal Server Error

**Vérifier les logs :**
```bash
cd backend
type storage\logs\laravel.log
```

**Recréer la base de données :**
```bash
php artisan migrate:fresh
```

### ❌ SQLSTATE Connection Refused

**MySQL non démarré**
- Ouvrir Laragon
- Démarrer MySQL

### ❌ Token non reconnu (401 Unauthorized)

**Vérifier :**
1. Le token est bien dans l'onglet "Authorization" de Postman
2. Type : "Bearer Token"
3. Copier-coller le token depuis la réponse de Login

---

## 📝 Test Manuel avec cURL

Si vous préférez tester sans Postman :

**1. Register :**
```bash
curl -X POST http://localhost:8000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"
```

**2. Login :**
```bash
curl -X POST http://localhost:8000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"email\":\"test@test.com\",\"password\":\"password123\"}"
```

**Note :** Remplacer `^` par `\` sur Linux/Mac

---

## 🔍 Commandes Utiles

```bash
# Voir toutes les routes API
cd backend
php artisan route:list --path=api

# Vider le cache
php artisan cache:clear
php artisan config:clear

# Voir l'état des migrations
php artisan migrate:status

# Recréer la BDD (EFFACE TOUT !)
php artisan migrate:fresh

# Créer un utilisateur de test
php artisan tinker
>>> $user = \App\Models\User::create(['name' => 'Test', 'email' => 'test@example.com', 'password' => \Hash::make('password123')]);
>>> $token = $user->createToken('test')->plainTextToken;
>>> echo $token;
```

---

## 📚 Documentation Complète

Pour plus de détails :
- **Guide complet :** [TEST_API.md](TEST_API.md)
- **Documentation API :** [docs/API_AUTHENTICATION.md](docs/API_AUTHENTICATION.md)

---

## 🎯 Prochaines Étapes

Une fois les tests réussis :

✅ **Jour 1 - Terminé !**
- [x] Modèles créés
- [x] Authentification API complète
- [x] Tests réussis

🚀 **Jour 2 - À faire :**
- [ ] DashboardController
- [ ] Seeders (données de test)
- [ ] PropertyController

---

**Bon courage ! 🚀**
