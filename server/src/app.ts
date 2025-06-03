import express, { Request, Response } from 'express';
import cors from 'cors';
import mainApiRouter from './routes'; // Importe le routeur principal de server/src/routes/index.ts
import authRoutes from './routes/auth'; // Importe les routes d'authentification
import connectDB from './config/db'; // Supposant que la connexion DB est dans server/src/config/db.ts

const app = express();

// Connexion à la base de données
connectDB();

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck endpoint (public) - DOIT ÊTRE AVANT LES AUTRES ROUTES
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Montage des routes
app.use('/auth', authRoutes); // Les routes /auth/login, /auth/register seront gérées ici
app.use('/api', mainApiRouter); // Les routes /api/users, /api/jobs, etc. seront gérées ici

// TODO: Ajouter un middleware de gestion des erreurs global ici

export default app; 