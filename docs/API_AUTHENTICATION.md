# API Authentication Documentation - Locagest Pro

**Date de création :** 19 Novembre 2025
**Version API :** 1.0
**Base URL :** `http://localhost:8000/api`

---

## 🔐 Authentification

L'API utilise **Laravel Sanctum** pour l'authentification par token.

### Flow d'Authentification

1. L'utilisateur s'inscrit via `/api/auth/register` ou se connecte via `/api/auth/login`
2. L'API retourne un `access_token`
3. Le client doit inclure ce token dans toutes les requêtes protégées :
   ```
   Authorization: Bearer {access_token}
   ```

---

## 📡 Endpoints d'Authentification

### 1. Inscription (Register)

**POST** `/api/auth/register`

Crée un nouveau compte utilisateur.

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+33612345678",
  "company_name": "Ma Société",
  "siret": "12345678901234",
  "is_company": true
}
```

**Champs requis:**
- `name` (string, max 255)
- `email` (string, email, unique)
- `password` (string, min 8)
- `password_confirmation` (string, doit correspondre)

**Champs optionnels:**
- `phone` (string, max 20)
- `company_name` (string, max 255)
- `siret` (string, 14 chiffres)
- `is_company` (boolean, default: false)

**Réponse (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+33612345678",
    "company_name": "Ma Société",
    "siret": "12345678901234",
    "is_company": true,
    "locale": "fr",
    "timezone": "Europe/Paris",
    "country": "FR",
    "created_at": "2025-11-19T10:00:00.000000Z",
    "updated_at": "2025-11-19T10:00:00.000000Z"
  },
  "access_token": "1|abcdefghijklmnopqrstuvwxyz1234567890",
  "token_type": "Bearer"
}
```

**Erreurs possibles:**
- `422 Unprocessable Entity` - Validation échouée
- `500 Internal Server Error` - Erreur serveur

---

### 2. Connexion (Login)

**POST** `/api/auth/login`

Authentifie un utilisateur existant.

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123",
  "device_name": "web"
}
```

**Champs requis:**
- `email` (string, email)
- `password` (string)

**Champs optionnels:**
- `device_name` (string) - Nom de l'appareil (default: "web")

**Réponse (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    ...
  },
  "access_token": "2|abcdefghijklmnopqrstuvwxyz1234567890",
  "token_type": "Bearer"
}
```

**Erreurs possibles:**
- `422 Unprocessable Entity` - Identifiants incorrects
- `500 Internal Server Error` - Erreur serveur

**Note:** Tous les anciens tokens sont révoqués lors de la connexion.

---

### 3. Déconnexion (Logout)

**POST** `/api/auth/logout`

Révoque le token actuel de l'utilisateur.

**Headers:**
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
```

**Body:** Aucun

**Réponse (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

**Erreurs possibles:**
- `401 Unauthorized` - Token invalide ou manquant
- `500 Internal Server Error` - Erreur serveur

---

### 4. Déconnexion Totale (Logout All Devices)

**POST** `/api/auth/logout-all`

Révoque tous les tokens de l'utilisateur (déconnexion de tous les appareils).

**Headers:**
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
```

**Body:** Aucun

**Réponse (200 OK):**
```json
{
  "message": "Logged out from all devices successfully"
}
```

---

### 5. Utilisateur Actuel (Me)

**GET** `/api/auth/me`

Récupère les informations de l'utilisateur authentifié.

**Headers:**
```
Accept: application/json
Authorization: Bearer {access_token}
```

**Réponse (200 OK):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+33612345678",
    "company_name": "Ma Société",
    "siret": "12345678901234",
    "is_company": true,
    "address": "123 Rue de la Paix",
    "city": "Paris",
    "postal_code": "75001",
    "country": "FR",
    "locale": "fr",
    "timezone": "Europe/Paris",
    "avatar": null,
    "created_at": "2025-11-19T10:00:00.000000Z",
    "updated_at": "2025-11-19T10:00:00.000000Z",
    "subscription": {
      "id": 1,
      "status": "active",
      "billing_cycle": "monthly",
      "plan": {
        "id": 1,
        "name": "Pro",
        "price_monthly": 29.99,
        "max_properties": 50
      }
    }
  }
}
```

**Note:** Inclut la souscription active avec le plan.

---

### 6. Mise à Jour du Profil (Update Profile)

**PUT** `/api/auth/profile`

Met à jour les informations du profil utilisateur.

**Headers:**
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+33612345678",
  "company_name": "Ma Nouvelle Société",
  "address": "456 Avenue des Champs",
  "city": "Lyon",
  "postal_code": "69000",
  "country": "FR",
  "locale": "en",
  "timezone": "Europe/Paris"
}
```

**Champs (tous optionnels):**
- `name` (string, max 255)
- `email` (string, email, unique)
- `phone` (string, max 20)
- `company_name` (string, max 255)
- `siret` (string, 14 chiffres)
- `address` (string, max 255)
- `city` (string, max 100)
- `postal_code` (string, max 10)
- `country` (string, 2 caractères - ISO)
- `locale` (string, 'fr' ou 'en')
- `timezone` (string, max 50)
- `is_company` (boolean)

**Réponse (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john.smith@example.com",
    ...
  }
}
```

---

### 7. Mise à Jour du Mot de Passe (Update Password)

**PUT** `/api/auth/password`

Change le mot de passe de l'utilisateur.

**Headers:**
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "current_password": "oldpassword123",
  "password": "newpassword456",
  "password_confirmation": "newpassword456"
}
```

**Champs requis:**
- `current_password` (string) - Mot de passe actuel
- `password` (string, min 8) - Nouveau mot de passe
- `password_confirmation` (string) - Confirmation

**Réponse (200 OK):**
```json
{
  "message": "Password updated successfully"
}
```

**Note:** Tous les tokens sont révoqués sauf le token actuel.

**Erreurs possibles:**
- `422 Unprocessable Entity` - Mot de passe actuel incorrect

---

### 8. Suppression du Compte (Delete Account)

**DELETE** `/api/auth/account`

Supprime le compte utilisateur (soft delete).

**Headers:**
```
Content-Type: application/json
Accept: application/json
Authorization: Bearer {access_token}
```

**Body:**
```json
{
  "password": "password123"
}
```

**Champs requis:**
- `password` (string) - Confirmation du mot de passe

**Réponse (200 OK):**
```json
{
  "message": "Account deleted successfully"
}
```

**Note:**
- Suppression logique (soft delete)
- Tous les tokens sont révoqués
- Les données sont conservées mais l'utilisateur ne peut plus se connecter

---

## 🧪 Exemples d'Utilisation

### cURL

**Inscription:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

**Connexion:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Récupérer l'utilisateur actuel:**
```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Accept: application/json" \
  -H "Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz"
```

### JavaScript (Axios)

```javascript
// Inscription
const register = async () => {
  const response = await axios.post('/api/auth/register', {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    password_confirmation: 'password123'
  });

  // Sauvegarder le token
  localStorage.setItem('token', response.data.access_token);
};

// Connexion
const login = async () => {
  const response = await axios.post('/api/auth/login', {
    email: 'john@example.com',
    password: 'password123'
  });

  localStorage.setItem('token', response.data.access_token);
};

// Configurer Axios pour toutes les requêtes
axios.defaults.headers.common['Authorization'] =
  `Bearer ${localStorage.getItem('token')}`;

// Récupérer l'utilisateur
const getUser = async () => {
  const response = await axios.get('/api/auth/me');
  return response.data.user;
};
```

---

## 🔒 Sécurité

### Bonnes Pratiques

1. **Stockage du Token**
   - Frontend SPA : `localStorage` ou `sessionStorage`
   - Ne jamais exposer le token dans l'URL

2. **HTTPS**
   - Toujours utiliser HTTPS en production
   - Jamais envoyer le token en HTTP

3. **Expiration**
   - Par défaut, les tokens n'expirent pas
   - Configurable dans `config/sanctum.php`

4. **CORS**
   - Configuré pour accepter `localhost:5173` (Vite) et `localhost:3000` (React)
   - Modifier `config/cors.php` pour la production

5. **Rate Limiting**
   - À implémenter pour éviter les attaques brute-force

---

## ⚠️ Codes d'Erreur

| Code | Description |
|------|-------------|
| `200` | Succès |
| `201` | Ressource créée |
| `401` | Non authentifié (token manquant/invalide) |
| `403` | Non autorisé (permissions insuffisantes) |
| `422` | Validation échouée |
| `500` | Erreur serveur |

---

## 📝 Notes de Développement

### Middleware Sanctum

Le middleware `auth:sanctum` est appliqué aux routes protégées dans `routes/api.php`.

### Révocation des Tokens

- **Login** : Tous les tokens précédents sont révoqués
- **Logout** : Seul le token actuel est révoqué
- **Logout All** : Tous les tokens sont révoqués
- **Update Password** : Tous les tokens sauf l'actuel sont révoqués
- **Delete Account** : Tous les tokens sont révoqués

### Soft Deletes

L'utilisateur utilise le trait `SoftDeletes`. La suppression est logique, les données sont conservées.

---

**Créé le :** 19 Novembre 2025
**Dernière mise à jour :** 19 Novembre 2025
**Par :** Claude (Assistant IA)
