FROM node:18-alpine

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du code source
COPY . .

# Build de l'application
RUN npm run build

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage de l'application
CMD ["npm", "start"] 