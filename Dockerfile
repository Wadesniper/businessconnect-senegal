# Étape de build
FROM node:18-bullseye-slim as builder

# Configuration des timeouts et des retries pour apt
RUN echo 'Acquire::http::Timeout "180";' > /etc/apt/apt.conf.d/99timeout
RUN echo 'Acquire::https::Timeout "180";' >> /etc/apt/apt.conf.d/99timeout
RUN echo 'Acquire::ftp::Timeout "180";' >> /etc/apt/apt.conf.d/99timeout

# Installation des dépendances système nécessaires avec retry
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    ca-certificates \
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
ENV NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=100000
ENV NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=600000
ENV NPM_CONFIG_FETCH_RETRIES=5

# Installation des dépendances avec retry
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retries 5 && \
    npm ci --only=production && \
    npm ci

# Copie du code source et des scripts
COPY server/src ./src
COPY server/scripts ./scripts

# Build du serveur
RUN npm run build

# Étape de production
FROM node:18-bullseye-slim

# Configuration des timeouts et des retries pour apt
RUN echo 'Acquire::http::Timeout "180";' > /etc/apt/apt.conf.d/99timeout
RUN echo 'Acquire::https::Timeout "180";' >> /etc/apt/apt.conf.d/99timeout
RUN echo 'Acquire::ftp::Timeout "180";' >> /etc/apt/apt.conf.d/99timeout

# Installation des dépendances minimales nécessaires avec retry
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copie des fichiers de configuration et du build depuis l'étape précédente
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts

# Configuration npm pour plus de stabilité
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error
ENV NPM_CONFIG_FETCH_RETRY_MINTIMEOUT=100000
ENV NPM_CONFIG_FETCH_RETRY_MAXTIMEOUT=600000
ENV NPM_CONFIG_FETCH_RETRIES=5

# Installation des dépendances de production uniquement avec retry
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retries 5 && \
    npm ci --only=production --no-optional

# Variables d'environnement
ENV PORT=3000
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Exposition du port
EXPOSE 3000

# Démarrage du serveur avec une configuration de production optimisée
CMD ["node", "--max-old-space-size=2048", "./dist/index.js"] 