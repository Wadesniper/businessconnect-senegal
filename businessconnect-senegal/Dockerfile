# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Installer les dépendances
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copier le code source
COPY . .

# Build client et server
RUN cd client && npm run build
RUN cd server && npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Installer les dépendances de production uniquement
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/client/package*.json ./client/
COPY --from=builder /app/server/package*.json ./server/

RUN npm install --production
RUN cd client && npm install --production
RUN cd server && npm install --production

# Copier les builds
COPY --from=builder /app/client/build ./client/build
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/client/nginx.conf ./client/nginx.conf

# Créer les répertoires nécessaires
RUN mkdir -p /data/users /data/cvs /data/formations /data/jobs /data/subscriptions /data/archives

# Installer et configurer Nginx
RUN apk add --no-cache nginx

# Exposer le port
EXPOSE 3000

# Script de démarrage
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"] 