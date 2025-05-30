# État du site BusinessConnect Sénégal

## Dernières modifications (31/05/2024)

### Corrections d'authentification
- Correction du routage frontend pour les pages de connexion et d'inscription
- Amélioration de la gestion des erreurs dans le service d'authentification
- Mise à jour de la configuration CORS pour gérer correctement les requêtes préflight
- Ajout du support des cookies et des en-têtes d'autorisation
- Amélioration des messages d'erreur pour une meilleure expérience utilisateur

### Configuration API
- URL de l'API en production : https://businessconnect-senegal-api-production.up.railway.app
- Domaines autorisés :
  - http://localhost:5173
  - http://localhost:3000
  - https://app.businessconnectsenegal.com
  - https://businessconnect-senegal.vercel.app
  - https://businessconnect-senegal-git-main-mouhamed-ali.vercel.app
  - https://businessconnectsenegal2025gooo.vercel.app

### État des fonctionnalités
- ✅ Inscription
- ✅ Connexion
- ✅ Gestion des profils
- ✅ Abonnements
- ✅ Marketplace
- ✅ Offres d'emploi
- ✅ CV Generator
- ✅ Formations

### Points d'attention
1. La validation du numéro de téléphone est stricte :
   - Format international : +221 7X XXX XX XX
   - Format local : 7X XXX XX XX
2. Les messages d'erreur sont plus descriptifs pour aider les utilisateurs
3. La gestion des sessions est améliorée avec déconnexion automatique en cas d'expiration

### Prochaines étapes
1. Surveiller les logs d'erreur pour identifier d'éventuels problèmes
2. Tester en profondeur les scénarios d'authentification
3. Vérifier la persistance des sessions utilisateur
4. Monitorer les performances de l'API

### Notes techniques
- Le frontend utilise React avec Vite
- Le backend est en Node.js avec Express
- Base de données MongoDB Atlas
- Déploiement : Vercel (frontend) et Railway (backend)
- CORS configuré avec support des cookies et des requêtes préflight

## 1. Architecture Technique

### 1.1 Stack Technologique
- **Backend** : Node.js + Express + TypeScript
- **Frontend** : React + Vite
- **Base de données** : MongoDB
- **Authentification** : JWT
- **Paiement** : CinetPay
- **Email** : Brevo (anciennement Sendinblue)
- **Stockage** : Système de fichiers local + Cloud (pour les CV et documents)
- **Tests** : Jest
- **Logging** : Winston
- **Validation** : Express Validator
- **Documentation** : Swagger/OpenAPI

### 1.2 Structure du Projet
```
businessconnect-senegal/
├── client-vite-fix/     # Frontend React
├── server/              # Backend Node.js
│   ├── src/
│   │   ├── config/     # Configuration
│   │   ├── controllers/# Logique métier
│   │   ├── middleware/ # Middlewares Express
│   │   ├── models/     # Modèles MongoDB
│   │   ├── routes/     # Routes API
│   │   ├── services/   # Services métier
│   │   ├── types/      # Types TypeScript
│   │   ├── utils/      # Utilitaires
│   │   └── scripts/    # Scripts utilitaires
│   ├── tests/          # Tests unitaires
│   └── dist/           # Code compilé
└── docs/               # Documentation
```

## 2. Modèles de Données

### 2.1 Utilisateur (User)
```typescript
interface User {
  _id: ObjectId;
  email?: string;          // Optionnel mais unique
  phoneNumber: string;     // Format sénégalais (70, 76, 77, 78)
  password: string;        // Hashé avec bcrypt
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  subscription?: {
    plan: string;
    status: string;
    startDate: Date;
    endDate: Date;
  };
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.2 Offre d'Emploi (Job)
```typescript
interface Job {
  _id: ObjectId;
  title: string;
  company: string;
  location: string;
  type: JobType;          // CDI, CDD, Stage, etc.
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  contactEmail: string;
  deadline: Date;
  status: JobStatus;
  views: number;
  applications: number;
  postedBy: ObjectId;     // Référence User
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.3 CV
```typescript
interface CV {
  _id: ObjectId;
  userId: ObjectId;       // Référence User
  personalInfo: {
    photo?: string;
    address: string;
    birthDate: Date;
    nationality: string;
  };
  education: [{
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }];
  experience: [{
    company: string;
    position: string;
    location: string;
    startDate: Date;
    endDate?: Date;
    description: string;
  }];
  skills: [{
    name: string;
    level: SkillLevel;
  }];
  languages: [{
    name: string;
    level: LanguageLevel;
  }];
  certifications: [{
    name: string;
    issuer: string;
    date: Date;
    expiryDate?: Date;
  }];
  references: [{
    name: string;
    position: string;
    company: string;
    contact: string;
  }];
  visibility: CVVisibility;
  lastUpdated: Date;
}
```

### 2.4 Abonnement (Subscription)
```typescript
interface Subscription {
  _id: ObjectId;
  userId: ObjectId;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  paymentHistory: [{
    transactionId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    provider: string;
    date: Date;
  }];
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.5 Marketplace
```typescript
interface MarketplaceItem {
  _id: ObjectId;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  seller: ObjectId;      // Référence User
  status: ItemStatus;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## 3. API Endpoints

### 3.1 Authentification
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/verify-email
- POST /api/auth/verify-phone
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET /api/auth/me
- PUT /api/auth/update-profile
- POST /api/auth/logout

### 3.2 Utilisateurs
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id
- GET /api/users/:id/cv
- GET /api/users/:id/applications
- GET /api/users/:id/jobs

### 3.3 Offres d'Emploi
- POST /api/jobs
- GET /api/jobs
- GET /api/jobs/:id
- PUT /api/jobs/:id
- DELETE /api/jobs/:id
- POST /api/jobs/:id/apply
- GET /api/jobs/search
- GET /api/jobs/categories
- GET /api/jobs/statistics

### 3.4 CV
- POST /api/cv
- GET /api/cv/:id
- PUT /api/cv/:id
- DELETE /api/cv/:id
- POST /api/cv/:id/visibility
- GET /api/cv/search
- POST /api/cv/upload-photo

### 3.5 Abonnements
- POST /api/subscriptions
- GET /api/subscriptions/current
- POST /api/subscriptions/cancel
- POST /api/subscriptions/renew
- GET /api/subscriptions/plans
- POST /api/subscriptions/webhook

### 3.6 Marketplace
- POST /api/marketplace
- GET /api/marketplace
- GET /api/marketplace/:id
- PUT /api/marketplace/:id
- DELETE /api/marketplace/:id
- GET /api/marketplace/search
- POST /api/marketplace/:id/contact

## 4. Services

### 4.1 Service d'Email (emailService)
- Envoi d'emails de vérification
- Notifications de réinitialisation de mot de passe
- Confirmations d'abonnement
- Alertes d'offres d'emploi
- Notifications de candidature
- Rapports quotidiens/hebdomadaires

### 4.2 Service de Paiement (cinetpayService)
- Initialisation des paiements
- Vérification des transactions
- Gestion des webhooks
- Génération des reçus
- Gestion des remboursements
- Rapports de transactions

### 4.3 Service d'Authentification (authService)
- Génération/Vérification JWT
- Gestion des sessions
- Validation des tokens
- Gestion des permissions
- Audit de sécurité
- Rate limiting

### 4.4 Service de Notification (notificationService)
- Notifications en temps réel
- Notifications push
- Notifications par email
- Notifications SMS
- File d'attente des notifications
- Templates de notification

### 4.5 Service de Stockage (storageService)
- Upload de fichiers
- Gestion des documents
- Optimisation des images
- Sauvegarde des fichiers
- Nettoyage automatique
- Gestion des quotas

## 5. Sécurité

### 5.1 Authentification
- JWT avec rotation des tokens
- Validation stricte des entrées
- Protection contre les injections
- Rate limiting par IP
- Blocage des IPs malveillantes
- Logs de sécurité

### 5.2 Autorisation
- RBAC (Role-Based Access Control)
- Middleware de vérification des rôles
- Validation des permissions
- Audit des accès
- Gestion des sessions
- Révocation des tokens

### 5.3 Protection des Données
- Chiffrement des données sensibles
- Hachage des mots de passe (bcrypt)
- Validation des données
- Sanitization des entrées
- Protection XSS
- Protection CSRF

### 5.4 Conformité
- RGPD
- Politique de confidentialité
- CGU
- Mentions légales
- Cookies
- Droit à l'oubli

## 6. Monitoring et Maintenance

### 6.1 Logging
- Logs applicatifs
- Logs d'erreurs
- Logs de sécurité
- Logs de performance
- Rotation des logs
- Alertes

### 6.2 Performance
- Caching Redis
- Optimisation MongoDB
- Compression gzip
- Minification
- Lazy loading
- CDN

### 6.3 Backup
- Sauvegarde quotidienne
- Réplication MongoDB
- Backup des fichiers
- Plan de reprise
- Rétention des données
- Tests de restauration

## 7. Scripts Utilitaires

### 7.1 Scripts de Base de Données
- Migration des données
- Seeding
- Nettoyage
- Indexation
- Optimisation
- Validation

### 7.2 Scripts de Maintenance
- Nettoyage des fichiers temporaires
- Purge des tokens expirés
- Archivage des vieilles données
- Mise à jour des statistiques
- Vérification de l'intégrité
- Génération de rapports

## 8. Plans d'Abonnement

### 8.1 Gratuit
- Consultation limitée des offres
- Création de CV basique
- Pas d'accès à la CVthèque
- Support basique
- Publicités
- Fonctionnalités limitées

### 8.2 Étudiant/Chercheur d'emploi (1000 FCFA/mois)
- Accès complet aux offres
- CV premium
- Alertes emploi
- Forum d'entraide
- Support standard
- Sans publicité

### 8.3 Annonceur (5000 FCFA/mois)
- Publication d'offres
- Statistiques de base
- Visibilité accrue
- Contact direct limité
- Support prioritaire
- Tableau de bord

### 8.4 Recruteur (9000 FCFA/mois)
- Accès CVthèque illimité
- Publication illimitée
- Statistiques avancées
- Contact direct illimité
- Support premium
- API access

## 9. Processus Métier

### 9.1 Inscription Utilisateur
1. Saisie des informations
2. Validation du numéro
3. Vérification email (optionnel)
4. Choix de l'abonnement
5. Paiement
6. Activation du compte

### 9.2 Publication d'Offre
1. Saisie de l'offre
2. Validation administrative
3. Publication
4. Notification aux candidats
5. Gestion des candidatures
6. Statistiques

### 9.3 Candidature
1. Création/Mise à jour CV
2. Recherche d'offres
3. Candidature
4. Suivi
5. Notifications
6. Feedback

### 9.4 Paiement
1. Choix du plan
2. Redirection CinetPay
3. Paiement
4. Webhook de confirmation
5. Activation des services
6. Notification

## 10. Roadmap

### 10.1 Court Terme (1-3 mois)
- Optimisation des performances
- Amélioration UX/UI
- Nouveaux moyens de paiement
- Tests automatisés
- Documentation API
- Monitoring avancé

### 10.2 Moyen Terme (3-6 mois)
- Application mobile
- IA pour matching
- Chat en direct
- Système de recommandation
- Intégration LinkedIn
- Analytics avancés

### 10.3 Long Terme (6-12 mois)
- Expansion régionale
- Marketplace de services
- Formation en ligne
- Certification interne
- API partenaires
- Blockchain CV

## 11. Points d'Attention

### 11.1 Technique
- Optimisation MongoDB
- Gestion de la charge
- Sécurité des données
- Performance API
- Backup/Restore
- Scalabilité

### 11.2 Métier
- Validation des offres
- Qualité des CV
- Satisfaction utilisateurs
- Taux de conversion
- Rétention clients
- ROI marketing

### 11.3 Légal
- RGPD
- Droit du travail
- Conditions d'utilisation
- Protection des données
- Contrats
- Litiges

## 12. Contacts Support

### 12.1 Support Technique
- Email: support@businessconnect.sn
- Téléphone: +221 XX XXX XX XX
- Horaires: 8h-18h GMT
- Temps de réponse: < 24h
- Escalade: Chef Technique
- Documentation: wiki interne

### 12.2 Support Client
- Email: contact@businessconnect.sn
- Téléphone: +221 XX XXX XX XX
- Horaires: 9h-17h GMT
- Temps de réponse: < 12h
- Escalade: Service Client
- FAQ: Aide en ligne

## 13. Configuration du Déploiement

### 13.1 Railway.app
- **Backend API**
  - Déploiement via Dockerfile
  - Build automatique sur push
  - Variables d'environnement requises configurées
  - Healthcheck sur /api/health
  - Redémarrage automatique en cas d'échec

### 13.2 Structure des Fichiers de Configuration
- **Dockerfile**
  - Build en deux étapes (builder et production)
  - Optimisé pour le backend Node.js
  - Gestion des dépendances et du build
  - Configuration des variables d'environnement

- **.railwayignore**
  - Exclusion des fichiers non nécessaires
  - Optimisation du déploiement
  - Protection des données sensibles
  - Séparation client/serveur

### 13.3 Variables d'Environnement Requises
- NODE_ENV
- PORT
- MONGODB_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- SMTP_* (configuration email)
- PAYTECH_* (configuration paiement)
- CLIENT_URL
- API_URL

### 13.4 Processus de Déploiement
1. Push sur la branche principale
2. Détection automatique par Railway
3. Build via Dockerfile
4. Vérification des variables d'environnement
5. Déploiement et démarrage du serveur
6. Vérification du healthcheck
7. Mise en production

### 13.5 État des Builds

#### Backend (server)
- Build Status: ✅ Succès
- Dépendances: Installées et à jour
- Points d'attention:
  - Une vulnérabilité critique à examiner
  - Audit de sécurité recommandé

#### Frontend (client-vite-fix)
- Build Status: ✅ Succès
- Dépendances: Installées avec avertissements de compatibilité React
- Assets générés: ~50 fichiers
- Points d'attention:
  - Optimisation des chunks recommandée (certains > 500KB)
  - Corrections TypeScript nécessaires:
    - Exports manquants dans api.ts
    - Types à compléter dans job.ts et user.ts
  - Avertissements de compatibilité React à résoudre

### 13.6 Optimisations Futures
1. Sécurité:
   - Résolution de la vulnérabilité backend
   - Mise à jour des dépendances critiques
   - Audit de sécurité complet

2. Performance:
   - Code splitting pour réduire la taille des chunks
   - Optimisation des imports dynamiques
   - Lazy loading des composants lourds

3. Qualité du Code:
   - Correction des types TypeScript
   - Résolution des avertissements de compatibilité
   - Standardisation des exports/imports

### 13.7 Notes de Déploiement Importantes
- **Root Directory** : Doit être configuré comme "server" dans Railway (pas "businessconnect-senegal/server")
- **Structure du Projet** :
  ```
  .
  ├── server/           # Backend (Root Directory pour Railway)
  ├── client-vite-fix/  # Frontend
  ├── Dockerfile        # À la racine uniquement
  └── .railway.toml     # Configuration Railway
  ```
- **Points Clés** :
  - Railway se place déjà à la racine du dépôt cloné
  - Éviter la duplication des fichiers de configuration
  - Maintenir une structure de projet claire et cohérente

## Configuration de déploiement

### Frontend (Vercel)
- URL de production : https://businessconnect-senegal.vercel.app
- Build command : `npm run build`
- Output directory : `dist`
- Install command : `npm install`

### Backend (Railway)
- URL de production : https://businessconnect-senegal-api-production.up.railway.app
- Root Directory : `server`
- Build command : `npm run build`
- Start command : `npm start`

## Authentification et Sécurité

### Configuration CORS
- Origines autorisées :
  - http://localhost:5173 (développement)
  - http://localhost:3000 (développement)
  - https://businessconnect-senegal.vercel.app (production)
  - https://businessconnect-senegal-api-production.up.railway.app (API)
- Méthodes : GET, POST, PUT, DELETE, OPTIONS, PATCH
- Headers : Content-Type, Authorization, X-Requested-With, Accept

### Routes et Middleware
- Routes publiques (sans authentification) :
  - /api/auth/* (login, register, etc.)
  - /api/webhooks/*
- Routes protégées (avec authentification) :
  - /api/subscriptions/*
  - /api/users/*

### Validation des numéros de téléphone
- Format accepté :
  - International : +221 7X XXX XX XX
  - Local : 7X XXX XX XX
- Validation côté client et serveur
- Formatage automatique des espaces

## État des builds

### Frontend
- ✅ Build Vercel : Succès
- ✅ Déploiement : Succès
- ✅ Tests : Passés

### Backend
- ✅ Build Railway : Succès
- ✅ Déploiement : Succès
- ✅ Tests : Passés

## Optimisations futures
- [ ] Amélioration de la gestion des erreurs
- [ ] Mise en cache des requêtes fréquentes
- [ ] Compression des assets
- [ ] Lazy loading des composants lourds
- [ ] Optimisation des images
- [ ] Mise en place de tests E2E

## 14. Dernières Corrections d'Authentification

### 14.1 Configuration des Routes
- Suppression du préfixe `/api` pour toutes les routes
- Routes publiques :
  - `/auth/*` (login, register, etc.)
  - `/webhooks/*`
- Routes protégées :
  - `/subscriptions/*`
  - `/users/*`
- Route de santé : `/health`

### 14.2 Middleware d'Authentification
- Amélioration de la gestion des tokens
- Messages d'erreur plus clairs et cohérents
- Meilleure gestion des erreurs JWT
- Séparation claire des erreurs d'authentification et serveur

### 14.3 Configuration CORS
- Origines autorisées :
  ```
  http://localhost:5173
  http://localhost:3000
  https://businessconnect-senegal.vercel.app
  https://businessconnect-senegal-api-production.up.railway.app
  ```
- Support complet des credentials
- Headers autorisés : Content-Type, Authorization, X-Requested-With, Accept, Origin
- Méthodes HTTP : GET, POST, PUT, DELETE, OPTIONS, PATCH

### 14.4 Client API
- Configuration axios avec withCredentials
- Gestion intelligente des tokens
- Interception et traitement des erreurs
- Redirection appropriée selon le contexte

### 14.5 Service d'Authentification
- Gestion centralisée du token et des données utilisateur
- Méthodes de stockage local sécurisées
- Vérification robuste de l'authentification
- Support des différents rôles utilisateur

### 14.6 Points d'Attention
- Ne pas modifier les URLs de déploiement
- Préserver la version complète du site
- Maintenir la compatibilité avec les builds existants
- Assurer la continuité du service

### 14.7 Corrections d'Inscription
- Uniformisation des noms de champs entre client et serveur
  - Utilisation de `phoneNumber` au lieu de `phone`
  - Validation cohérente des numéros de téléphone
- Format des numéros acceptés :
  - International : +221 7X XXX XX XX
  - Local : 7X XXX XX XX
- Gestion des erreurs améliorée :
  - Messages d'erreur plus clairs
  - Validation côté client renforcée
  - Meilleure gestion des réponses serveur

### 14.8 Points de Vigilance
- Ne pas modifier les URLs de déploiement
- Maintenir la cohérence des noms de champs
- Préserver la validation des données
- Assurer la rétrocompatibilité

### 14.9 Configuration de l'API en Production
- URL de base : https://businessconnect-senegal-api-production.up.railway.app
- Suppression de la dépendance aux variables d'environnement
- Configuration CORS mise à jour :
  - Origines autorisées
  - Headers nécessaires
  - Support des credentials
- Routes API :
  - Suppression du préfixe `/api`
  - Routes publiques : `/auth/*`, `/webhooks/*`
  - Routes protégées : `/subscriptions/*`, `/users/*`

### 14.10 Sécurité et Validation
- Vérification des tokens côté serveur
- Validation des données côté client
- Gestion des erreurs CORS
- Protection contre les requêtes non autorisées
