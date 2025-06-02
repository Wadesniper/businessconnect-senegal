# Étape de build
FROM node:18-alpine as builder

# Installation des dépendances système nécessaires
# Optimisation : installation séparée pour une meilleure gestion de la mémoire
RUN apk add --no-cache python3
RUN apk add --no-cache make
RUN apk add --no-cache g++

# Définition du répertoire de travail
WORKDIR /app/server

# Copie et installation des dépendances d'abord pour optimiser le cache
COPY server/package*.json ./
RUN npm ci --only=production
RUN npm ci

# Copie des fichiers de configuration
COPY server/tsconfig.json ./
COPY server/jest.config.js ./

# Copie du code source et des scripts
COPY server/src ./src
COPY server/scripts ./scripts

# Build du serveur avec une limite de mémoire explicite
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm run build

# Étape de production
FROM node:18-alpine

WORKDIR /app/server

# Copie des fichiers de configuration et du build depuis l'étape précédente
COPY --from=builder /app/server/package*.json ./
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/scripts ./scripts

# Installation des dépendances de production uniquement avec une limite de mémoire
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm ci --only=production --no-optional

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage du serveur avec une limite de mémoire appropriée
CMD ["node", "--max-old-space-size=512", "./dist/index.js"] 