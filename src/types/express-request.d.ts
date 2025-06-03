// Augmenter le type Request global d'Express
import { UserPayload } from './user'; // Maintenir si express-request.d.ts est dans src/types/
// Si UserPayload est dans src/types/user.ts et express-request.d.ts est aussi dans src/types/

declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload;
    }
  }
}

// Ce fichier est purement pour les déclarations de types globaux.
// Il n'est pas nécessaire d'exporter quoi que ce soit ici.
export {}; // Nécessaire si --isolatedModules est activé, pour traiter ceci comme un module. 