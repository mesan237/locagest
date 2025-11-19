# Locagest Pro - Frontend

Application React avec TypeScript pour la gestion immobilière.

## Technologies

- **React 19** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **TailwindCSS 4** - Framework CSS
- **TanStack Router** - Routing avec type-safety
- **TanStack Query** - Gestion d'état serveur et cache
- **Zustand** - Gestion d'état global
- **React Hook Form** - Gestion de formulaires
- **Zod** - Validation de schémas
- **Axios** - Client HTTP
- **Lucide React** - Icônes

## Installation

```bash
cd frontend
npm install
```

## Configuration

Créer un fichier `.env`:

```bash
cp .env.example .env
```

Variables:
```env
VITE_API_URL=http://localhost:8000/api
```

## Commandes

```bash
npm run dev      # Développement (localhost:5173)
npm run build    # Build production
npm run preview  # Preview production
npm run lint     # Vérifier le code
```

## Structure

```
src/
├── api/              # Configuration Axios
├── components/       # Composants React
│   ├── ui/          # Button, Input, Card, Alert, Spinner
│   ├── features/    # LoginForm, RegisterForm
│   └── layouts/     # Layouts
├── hooks/           # useAuth
├── pages/           # Login, Register, Dashboard
├── routes/          # Configuration TanStack Router
├── services/        # authService
├── stores/          # authStore (Zustand)
└── types/           # Types TypeScript
```

## Authentification

```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, login, logout, register } = useAuth();

login({ email: 'user@example.com', password: 'password' });
```

## Routes

- `/` → Redirection auto
- `/login` → Connexion
- `/register` → Inscription
- `/dashboard` → Dashboard (protégé)
