# BusinessConnect Sénégal

Plateforme de mise en relation professionnelle et de services business au Sénégal.

## Technologies utilisées

- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Frontend**: React, Next.js, TypeScript
- **Déploiement**: Railway (Backend), Vercel (Frontend)

## Fonctionnalités principales

- Système d'authentification
- Gestion des profils utilisateurs
- Publication et recherche d'offres d'emploi
- Marketplace de services
- Forum de discussion
- Système de paiement
- Générateur de CV

## Installation

```bash
# Installation des dépendances
cd businessconnect-senegal/server
npm install

# Configuration
cp .env.example .env
# Remplir les variables d'environnement

# Démarrage en développement
npm run dev
```

## Structure du projet

```
businessconnect-senegal/
├── server/           # Backend
│   ├── src/
│   │   ├── routes/  # Routes API
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   └── ...
└── client/          # Frontend (à venir)
```

## Déploiement

Le projet est configuré pour un déploiement automatique :
- Backend : Railway
- Frontend : Vercel (à venir)

## Licence

Tous droits réservés © 2024 BusinessConnect Sénégal 