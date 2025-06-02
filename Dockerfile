# Étape de build
FROM node:18-alpine as builder

# Installation des dépendances système nécessaires
RUN apk add --no-cache python3 make g++

# Définition du répertoire de travail
WORKDIR /app/server

# Copie des fichiers de configuration du serveur
COPY server/package*.json ./
COPY server/tsconfig.json ./
COPY server/jest.config.js ./

# Copie du code source et des scripts
COPY server/src ./src
COPY server/scripts ./scripts

# Installation des dépendances avec un cache optimisé
RUN npm ci

# Build du serveur
RUN npm run build

# Étape de production
FROM node:18-alpine

WORKDIR /app/server

# Copie des fichiers de configuration et du build depuis l'étape précédente
COPY --from=builder /app/server/package*.json ./
COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/server/scripts ./scripts

# Installation des dépendances de production uniquement
RUN npm ci --only=production

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage du serveur
CMD ["npm", "start"] 