import { UserPayload } from './user.js'; // UserPayload est dans le même dossier types/

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Ajout d'un export vide pour s'assurer que le fichier est traité comme un module.
// Ceci est important si l'option tsconfig "isolatedModules" est activée.
export {}; 