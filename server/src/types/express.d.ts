import { UserPayload } from './user.js'; // Doit pointer vers le bon fichier UserPayload

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Ajoute user comme propriété optionnelle à Express.Request
    }
  }
}

// Tout le reste de ce fichier a été supprimé pour éviter les conflits 
// et les redéfinitions. Les types personnalisés iront dans custom.express.ts. 