FROM node:18-alpine as builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances et react-scripts globalement
RUN npm install
RUN npm install -g react-scripts

# Copie du code source
COPY . .

# Correction des permissions sur react-scripts
RUN chmod +x ./node_modules/.bin/react-scripts

# Build de l'application avec le chemin complet
RUN ./node_modules/.bin/react-scripts build

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Installation de serve
RUN npm install -g serve

# Copie des fichiers nécessaires depuis l'étape de build
COPY --from=builder /app/build ./build

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["serve", "-s", "build", "-l", "3000"] 