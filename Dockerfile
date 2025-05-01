# Étape de build du serveur
FROM node:18-alpine AS server-builder

WORKDIR /app/server

# Copie des fichiers du serveur
COPY businessconnect-senegal/server/package*.json ./
COPY businessconnect-senegal/server/tsconfig.json ./
RUN npm install

# Copie du code source du serveur
COPY businessconnect-senegal/server/src ./src
RUN npm run build

# Étape de build du client
FROM node:18-alpine AS client-builder

WORKDIR /app/client

# Copie des fichiers du client
COPY businessconnect-senegal/client/package*.json ./
COPY businessconnect-senegal/client/tsconfig.json ./
RUN npm install

# Copie du code source du client
COPY businessconnect-senegal/client/src ./src
COPY businessconnect-senegal/client/public ./public
RUN npm run build

# Étape de production
FROM node:18-alpine

WORKDIR /app

# Copie des fichiers du serveur
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/package*.json ./
COPY --from=server-builder /app/server/node_modules ./node_modules

# Copie des fichiers du client
COPY --from=client-builder /app/client/build ./public

# Configuration pour la production
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Création d'un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Démarrage de l'application
CMD ["npm", "start"] 