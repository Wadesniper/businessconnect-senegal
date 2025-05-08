#!/bin/bash

# Créer le répertoire SSL s'il n'existe pas
mkdir -p ssl

# Générer la clé privée et le certificat auto-signé
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/server.key -out ssl/server.crt \
  -subj "/C=SN/ST=Dakar/L=Dakar/O=BusinessConnect/CN=localhost"

# Définir les permissions appropriées
chmod 600 ssl/server.key
chmod 644 ssl/server.crt

echo "Certificats SSL générés avec succès dans le dossier ssl/" 