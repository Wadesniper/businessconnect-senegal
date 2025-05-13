export const CACHE_CONFIG = {
  // Durée de vie du cache en secondes
  ttl: {
    user: 3600, // 1 heure
    cv: 3600,
    jobs: 1800, // 30 minutes
    forum: 900, // 15 minutes
    marketplace: 1800,
    templates: 86400 // 24 heures
  },
  
  // Préfixes des clés de cache
  prefix: {
    user: 'user:',
    cv: 'cv:',
    jobs: 'jobs:',
    forum: 'forum:',
    marketplace: 'marketplace:',
    templates: 'templates:'
  },
  
  // Configuration du stockage local
  storage: {
    prefix: 'businessconnect:',
    version: '1.0.0'
  }
}; 