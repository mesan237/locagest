# Guide de Test de l'API - Locagest Pro

**Date :** 19 Novembre 2025

Ce guide vous permet de tester tous les endpoints d'authentification de l'API.

---

## 🚀 Démarrage du Serveur

### Option 1 : Laragon (Recommandé)
1. Ouvrir Laragon
2. Cliquer sur "Start All"
3. Le serveur sera accessible sur : `http://locagest.test` ou `http://localhost`

### Option 2 : PHP Artisan
```bash
cd backend
php artisan serve
```
L'API sera accessible sur : `http://localhost:8000`

---

## 📝 Pré-requis

### 1. Vérifier que MySQL est démarré
Dans Laragon ou XAMPP, assurez-vous que MySQL est actif.

### 2. Vérifier les routes API
```bash
cd backend
php artisan route:list --path=api
```

Vous devriez voir :
```
POST   api/auth/register
POST   api/auth/login
POST   api/auth/logout (auth:sanctum)
POST   api/auth/logout-all (auth:sanctum)
GET    api/auth/me (auth:sanctum)
PUT    api/auth/profile (auth:sanctum)
PUT    api/auth/password (auth:sanctum)
DELETE api/auth/account (auth:sanctum)
```

---

## 🧪 Tests avec cURL

**Note :** Remplacez `http://localhost:8000` par votre URL (ex: `http://locagest.test`)

### 1. Test d'Inscription (Register)

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"name\": \"John Doe\",
    \"email\": \"john@example.com\",
    \"password\": \"password123\",
    \"password_confirmation\": \"password123\",
    \"phone\": \"+33612345678\",
    \"is_company\": false
  }"
```

**Réponse attendue (201) :**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  },
  "access_token": "1|abcd1234...",
  "token_type": "Bearer"
}
```

**💡 IMPORTANT :** Sauvegardez le `access_token` pour les tests suivants !

---

### 2. Test de Connexion (Login)

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"email\": \"john@example.com\",
    \"password\": \"password123\"
  }"
```

**Réponse attendue (200) :**
```json
{
  "message": "Login successful",
  "user": { ... },
  "access_token": "2|xyz789...",
  "token_type": "Bearer"
}
```

---

### 3. Test Récupération Utilisateur (Me)

**⚠️ Remplacez `YOUR_TOKEN_HERE` par le token obtenu lors du login**

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Réponse attendue (200) :**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "subscription": null
  }
}
```

---

### 4. Test Mise à Jour Profil (Update Profile)

```bash
curl -X PUT http://localhost:8000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{
    \"name\": \"John Smith\",
    \"phone\": \"+33698765432\",
    \"city\": \"Paris\"
  }"
```

**Réponse attendue (200) :**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "phone": "+33698765432",
    "city": "Paris",
    ...
  }
}
```

---

### 5. Test Mise à Jour Mot de Passe (Update Password)

```bash
curl -X PUT http://localhost:8000/api/auth/password \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{
    \"current_password\": \"password123\",
    \"password\": \"newpassword456\",
    \"password_confirmation\": \"newpassword456\"
  }"
```

**Réponse attendue (200) :**
```json
{
  "message": "Password updated successfully"
}
```

---

### 6. Test Déconnexion (Logout)

```bash
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Réponse attendue (200) :**
```json
{
  "message": "Logged out successfully"
}
```

---

### 7. Test Déconnexion Totale (Logout All)

```bash
curl -X POST http://localhost:8000/api/auth/logout-all \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Réponse attendue (200) :**
```json
{
  "message": "Logged out from all devices successfully"
}
```

---

### 8. Test Suppression Compte (Delete Account)

```bash
curl -X DELETE http://localhost:8000/api/auth/account \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{
    \"password\": \"password123\"
  }"
```

**Réponse attendue (200) :**
```json
{
  "message": "Account deleted successfully"
}
```

---

## 🧪 Tests avec Postman

### Configuration de Base

1. **Créer une nouvelle collection** "Locagest API"

2. **Variables d'environnement :**
   - `base_url` : `http://localhost:8000`
   - `token` : (sera rempli automatiquement)

3. **Headers globaux :**
   - `Accept` : `application/json`
   - `Content-Type` : `application/json`

### Requêtes Postman

#### 1. POST Register
- **URL :** `{{base_url}}/api/auth/register`
- **Method :** POST
- **Body (raw JSON) :**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Script Post-response (onglet Tests) :**
```javascript
if (pm.response.code === 201) {
    pm.environment.set("token", pm.response.json().access_token);
    console.log("Token saved:", pm.environment.get("token"));
}
```

#### 2. POST Login
- **URL :** `{{base_url}}/api/auth/login`
- **Method :** POST
- **Body (raw JSON) :**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Script Post-response :**
```javascript
if (pm.response.code === 200) {
    pm.environment.set("token", pm.response.json().access_token);
}
```

#### 3. GET Me
- **URL :** `{{base_url}}/api/auth/me`
- **Method :** GET
- **Headers :**
  - `Authorization` : `Bearer {{token}}`

#### 4. PUT Profile
- **URL :** `{{base_url}}/api/auth/profile`
- **Method :** PUT
- **Headers :**
  - `Authorization` : `Bearer {{token}}`
- **Body (raw JSON) :**
```json
{
  "name": "Updated Name",
  "phone": "+33600000000"
}
```

#### 5. POST Logout
- **URL :** `{{base_url}}/api/auth/logout`
- **Method :** POST
- **Headers :**
  - `Authorization` : `Bearer {{token}}`

---

## ✅ Checklist de Test

### Tests Basiques
- [ ] Inscription d'un nouvel utilisateur
- [ ] Connexion avec les identifiants créés
- [ ] Récupération des informations utilisateur
- [ ] Mise à jour du profil
- [ ] Déconnexion

### Tests de Validation
- [ ] Inscription avec email déjà utilisé (doit échouer)
- [ ] Connexion avec mauvais mot de passe (doit échouer)
- [ ] Accès à une route protégée sans token (doit échouer - 401)
- [ ] Accès avec token invalide (doit échouer - 401)
- [ ] Mise à jour profil avec email existant (doit échouer)

### Tests de Sécurité
- [ ] Changement de mot de passe
- [ ] Vérification que l'ancien token est révoqué après changement de mot de passe
- [ ] Déconnexion de tous les appareils
- [ ] Suppression de compte

---

## 🐛 Debugging

### Erreur 404 - Route Not Found

**Solution :**
```bash
cd backend
php artisan route:clear
php artisan config:clear
php artisan cache:clear
```

### Erreur 500 - Internal Server Error

**Vérifier les logs :**
```bash
cd backend
tail -f storage/logs/laravel.log
```

### Erreur CORS

**Vérifier :** `backend/config/cors.php`
- Assurez-vous que votre domaine frontend est dans `allowed_origins`

### Token non reconnu

**Vérifier :**
1. Format : `Authorization: Bearer {token}` (avec espace après Bearer)
2. Le token est bien dans les headers
3. Le middleware `auth:sanctum` est appliqué

---

## 📊 Résultats Attendus

### Tous les tests passent ✅
```
✅ Register : 201 Created
✅ Login : 200 OK
✅ Me : 200 OK
✅ Update Profile : 200 OK
✅ Update Password : 200 OK
✅ Logout : 200 OK
✅ Logout All : 200 OK
✅ Delete Account : 200 OK
```

### En cas d'échec
- Vérifier que la base de données est accessible
- Vérifier que les migrations sont exécutées
- Vérifier les logs Laravel
- Vérifier la configuration Sanctum

---

## 💡 Commandes Utiles

```bash
# Vérifier l'état de la base de données
cd backend
php artisan migrate:status

# Recréer la base de données (ATTENTION : efface tout)
php artisan migrate:fresh

# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Voir toutes les routes
php artisan route:list

# Créer un utilisateur de test via tinker
php artisan tinker
> $user = App\Models\User::create(['name' => 'Test', 'email' => 'test@test.com', 'password' => Hash::make('password')]);
> $user->createToken('test')->plainTextToken
```

---

**Créé le :** 19 Novembre 2025
**Dernière mise à jour :** 19 Novembre 2025
