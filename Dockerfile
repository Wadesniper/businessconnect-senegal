# Étape de build
FROM node:18-alpine as builder

# Définition du répertoire de travail
WORKDIR /app

# Copie des fichiers package
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie des sources
COPY . .

# Build du serveur
RUN npm run build

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Copie des dépendances et du build depuis l'étape précédente
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage du serveur
CMD ["npm", "start"] 