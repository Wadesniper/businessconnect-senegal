# Etape 1: Builder
# Utilise une image Node.js 18 stable
FROM node:18-bullseye-slim AS builder

# Définit l'environnement de production pour le build
ENV NODE_ENV=production

# Définit le répertoire de travail
WORKDIR /app

# Copie d'abord les fichiers de dépendances pour profiter du cache Docker
COPY server/package.json server/package-lock.json ./

# Installe les dépendances (y compris les devDependencies nécessaires pour le build)
# `npm ci` est plus rapide et plus fiable pour les builds
RUN npm ci

# Copie le reste du code source du serveur
COPY server/ ./

# Génère le client Prisma (bonne pratique avant le build)
RUN npx prisma generate

# Construit l'application TypeScript en JavaScript
RUN npm run build

# Etape 2: Production
# Utilise une image Node.js 18 slim pour une taille réduite
FROM node:18-bullseye-slim AS production

# Définit l'environnement de production
ENV NODE_ENV=production

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers de dépendances depuis l'étape de build
COPY --from=builder /app/package.json /app/package-lock.json ./

# Installe UNIQUEMENT les dépendances de production
RUN npm ci --omit=dev

# Copie les artefacts de build (le code JavaScript compilé) depuis l'étape de build
COPY --from=builder /app/dist ./dist

# Copie le schéma Prisma nécessaire pour l'exécution
COPY --from=builder /app/prisma ./prisma

# Expose le port sur lequel l'application va tourner
EXPOSE 8080

# Commande pour démarrer l'application
CMD ["node", "dist/server.js"] 