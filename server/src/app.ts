import express from 'express';
import cors from 'cors';
import mainApiRouter from './routes/index.js'; // Importe le routeur principal de server/src/routes/index.ts
import authRoutes from './routes/auth.js'; // Importe les routes d'authentification

const app = express();

// Middlewares de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Montage des routes
app.use('/auth', authRoutes); // Les routes /auth/login, /auth/register seront gérées ici
app.use('/api', mainApiRouter); // Les routes /api/users, /api/jobs, etc. seront gérées ici

// TODO: Ajouter un middleware de gestion des erreurs global ici

export default app; 