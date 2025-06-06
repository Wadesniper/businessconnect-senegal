# Etape 1: Builder - Installation des dépendances et compilation
FROM node:18-bullseye-slim AS builder

# Définit le répertoire de travail pour correspondre à la structure du projet
WORKDIR /app/server

# Copie d'abord les fichiers de manifeste de dépendances pour optimiser le cache Docker
COPY server/package.json server/package-lock.json ./

# Installe TOUTES les dépendances (y compris devDependencies) pour le build
RUN npm ci

# Copie le reste du code source du backend
COPY server/ ./

# Génère le client Prisma (crucial avant la compilation)
RUN npx prisma generate

# Construit l'application TypeScript en JavaScript
RUN npm run build


# Etape 2: Production - Création de l'image finale légère
FROM node:18-bullseye-slim AS production

# Définit l'environnement de production
ENV NODE_ENV=production

# Définit le répertoire de travail
WORKDIR /app/server

# Copie les fichiers de manifeste depuis l'étape de build
COPY --from=builder /app/server/package.json /app/server/package-lock.json ./

# Installe UNIQUEMENT les dépendances de production
RUN npm ci --omit=dev

# Copie le code JavaScript compilé depuis l'étape de build
COPY --from=builder /app/server/dist ./dist

# Copie le schéma Prisma, nécessaire pour l'exécution du client
COPY --from=builder /app/server/prisma ./prisma

# Expose le port sur lequel l'application va tourner
EXPOSE 8080

# Commande pour démarrer l'application en production
CMD ["node", "dist/server.js"] 