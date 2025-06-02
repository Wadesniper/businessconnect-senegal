# Étape de build
FROM node:18-bullseye-slim as builder

# Installation des dépendances système nécessaires
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Définition du répertoire de travail
WORKDIR /app/server

# Copie et installation des dépendances d'abord pour optimiser le cache
COPY server/package*.json ./

# Installation des dépendances avec une configuration npm optimisée
ENV NPM_CONFIG_LOGLEVEL=error
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm set progress=false && \
    npm config set depth 0 && \
    npm ci --only=production && \
    npm ci

# Copie des fichiers de configuration
COPY server/tsconfig.json ./
COPY server/jest.config.js ./

# Copie du code source et des scripts
COPY server/src ./src
COPY server/scripts ./scripts

# Build du serveur
RUN npm run build

# Étape de production
FROM node:18-bullseye-slim

# Installation des dépendances minimales nécessaires
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server

# Copie des fichiers de configuration et du build depuis l'étape précédente
COPY --from=builder /app/server/package*.json ./
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/scripts ./scripts

# Installation des dépendances de production uniquement
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error
RUN npm ci --only=production --no-optional

# Variables d'environnement
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage du serveur avec une configuration de production optimisée
CMD ["node", "--max-old-space-size=2048", "./dist/index.js"] 