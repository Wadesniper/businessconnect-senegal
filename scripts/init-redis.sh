#!/bin/bash

# Configuration de Redis
redis-cli config set maxmemory 2gb
redis-cli config set maxmemory-policy allkeys-lru
redis-cli config set notify-keyspace-events Ex

# Création des index pour la recherche
redis-cli FT.CREATE formations_idx ON HASH PREFIX 1 formation: SCHEMA title TEXT SORTABLE description TEXT category TAG SORTABLE price NUMERIC SORTABLE rating NUMERIC SORTABLE
redis-cli FT.CREATE users_idx ON HASH PREFIX 1 user: SCHEMA email TEXT SORTABLE role TAG SORTABLE status TAG

# Configuration des clés de cache par défaut
redis-cli config set databases 16
redis-cli select 0

# Configuration de la persistance
redis-cli config set appendonly yes
redis-cli config set appendfsync everysec

echo "Configuration Redis terminée avec succès" 