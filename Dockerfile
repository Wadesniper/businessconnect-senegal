# Étape de build
FROM node:18-alpine as builder

# Installation des dépendances système nécessaires
RUN apk add --no-cache python3 make g++

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration du serveur
COPY server/package*.json ./
COPY server/tsconfig.json ./
COPY server/jest.config.js ./

# Copie du code source du serveur
COPY server/src ./src

# Installation des dépendances avec un cache optimisé
RUN npm ci

# Build du serveur
RUN npm run build

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Copie des dépendances de production et du build depuis l'étape précédente
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Installation des dépendances de production uniquement
RUN npm ci --only=production

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage du serveur
CMD ["npm", "start"] 