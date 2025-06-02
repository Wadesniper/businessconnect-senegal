# Étape de build
FROM node:18-bullseye AS builder

# Configuration du répertoire de travail
WORKDIR /app/server

# Copie des fichiers de configuration
COPY server/package*.json ./
COPY server/tsconfig.json ./
COPY server/jest.config.js ./

# Installation des dépendances
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm ci

# Copie des sources
COPY server/src ./src
COPY server/scripts ./scripts

# Build de l'application
RUN npm run build

# Étape de production
FROM node:18-bullseye

# Installation des dépendances système nécessaires
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Configuration du répertoire de travail
WORKDIR /app/server

# Copie des fichiers de l'étape de build
COPY --from=builder /app/server/package*.json ./
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/scripts ./scripts

# Installation des dépendances de production
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm ci --only=production

# Variables d'environnement
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["node", "--max-old-space-size=2048", "dist/index.js"] 