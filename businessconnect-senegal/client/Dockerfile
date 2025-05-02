FROM node:18-alpine as builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Installation de serve
RUN npm install -g serve

# Copie des fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["serve", "-s", "build", "-l", "3000"] 