# Étape de build
FROM debian:bullseye-slim as builder

# Installation de Node.js et des dépendances de base
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y --no-install-recommends \
    nodejs \
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

# Configuration npm pour plus de stabilité
ENV NPM_CONFIG_LOGLEVEL=error
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NPM_CONFIG_FETCH_RETRIES=5

# Installation des dépendances
RUN npm ci --only=production && \
    npm ci

# Copie du code source et des scripts
COPY server/src ./src
COPY server/scripts ./scripts

# Build du serveur
RUN npm run build

# Étape de production
FROM debian:bullseye-slim

# Installation de Node.js
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y --no-install-recommends \
    nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copie des fichiers de configuration et du build depuis l'étape précédente
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

# Configuration npm pour la production
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Installation des dépendances de production uniquement
RUN npm ci --only=production --no-optional

# Variables d'environnement
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage du serveur avec une configuration de production optimisée
CMD ["node", "--max-old-space-size=2048", "./dist/index.js"] 