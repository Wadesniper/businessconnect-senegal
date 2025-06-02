# Étape de build
FROM node:18-bullseye AS builder

# Configuration du répertoire de travail
WORKDIR /app/server

# Copie des fichiers du serveur
COPY . .

# Installation des dépendances et build
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Build de production sans les tests
RUN npm ci && \
    npm run build

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

# Installation des dépendances de production uniquement
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm ci --only=production

# Variables d'environnement
ENV PORT=8080

# Exposition du port
EXPOSE 8080

# Démarrage de l'application
CMD ["node", "--max-old-space-size=2048", "dist/server.js"] 