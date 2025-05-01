#!/bin/sh

# Démarrer Nginx
nginx -c /app/client/nginx.conf

# Démarrer le serveur Node.js
cd /app/server && node dist/index.js 