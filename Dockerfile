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
WORKDIR /app

# Copie des fichiers de configuration du serveur
COPY server/package*.json ./
COPY server/tsconfig.json ./
COPY server/jest.config.js ./

# Installation des dépendances avec une configuration npm optimisée
ENV NPM_CONFIG_LOGLEVEL=error
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm ci --only=production && \
    npm ci

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

WORKDIR /app

# Copie des fichiers de configuration et du build depuis l'étape précédente
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

# Installation des dépendances de production uniquement
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error
RUN npm ci --only=production --no-optional

# Variables d'environnement
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Exposition du port
EXPOSE 3000

# Démarrage du serveur avec une configuration de production optimisée
CMD ["node", "--max-old-space-size=2048", "./dist/index.js"] 