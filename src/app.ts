import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimiter } from './middlewares/rateLimiter';
import { authMiddleware } from './middlewares/authMiddleware';
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './routes';
import { config } from './config';
import { logger } from './utils/logger';

const app = express();

// Middlewares de sécurité
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Routes publiques
app.use('/api/auth', routes.auth);

// Middleware d'authentification pour les routes protégées
app.use('/api/*', authMiddleware.authenticate);

// Routes protégées
app.use('/api/users', routes.users);
app.use('/api/jobs', routes.jobs);
app.use('/api/subscriptions', routes.subscriptions);

// Gestion des erreurs
app.use(errorHandler);

export { app }; 