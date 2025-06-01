FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig.json ./

# Installer toutes les dépendances pour le build
RUN npm ci

# Copier les sources
COPY . .

# Build avec les variables d'environnement correctes
ENV NODE_ENV=production
RUN npm run build

# Stage de production
FROM node:20-alpine AS production

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer uniquement les dépendances de production
ENV NODE_ENV=production
RUN npm ci --omit=dev

# Copier le build depuis l'étape précédente
COPY --from=builder /app/dist ./dist

# Exposer le port
EXPOSE 5000

# Démarrer l'application
CMD ["npm", "start"] 