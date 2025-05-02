FROM node:18-alpine

WORKDIR /app

# Installation de serve globalement
RUN npm install -g serve

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation des dépendances avec les permissions appropriées
RUN npm install

# Installation de react-scripts globalement
RUN npm install -g react-scripts

# Copie du code source
COPY . .

# Build de l'application avec npm
RUN npm run build

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Démarrage de l'application en utilisant serve
CMD ["serve", "-s", "build", "-l", "3000"] 