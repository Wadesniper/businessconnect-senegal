# Étape de build
FROM node:18-alpine as builder

# Définition du répertoire de travail
WORKDIR /app

# Installation des dépendances
COPY package*.json ./
RUN npm install

# Build du projet
COPY . .
RUN npm run build

# Image de production
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["npm", "start"] 