# Étape de build
FROM node:18-alpine as builder

# Définition du répertoire de travail
WORKDIR /app

# Installation des dépendances globales
RUN npm install -g react-scripts

# Copie des fichiers package
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie des sources
COPY . .

# Build de l'application
RUN npm run build

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Installation de serve
RUN npm install -g serve

# Copie des fichiers de build depuis l'étape précédente
COPY --from=builder /app/build ./build

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["serve", "-s", "build", "-l", "3000"] 