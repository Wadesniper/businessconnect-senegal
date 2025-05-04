#!/bin/bash

# Installation des dépendances
echo "Installing dependencies..."
yarn install

# Build du projet
echo "Building project..."
yarn build

# Démarrage du serveur
echo "Starting server..."
yarn start

# Copie des fichiers nécessaires dans le répertoire de déploiement
cp web.config dist/
cp package.json dist/
cp package-lock.json dist/

# Installation des dépendances de production dans le répertoire de déploiement
cd dist
npm install --only=production 