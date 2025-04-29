import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import subscriptionRoutes from './routes/subscription.routes';
import { logger } from './utils/logger';

const app = express();

// Middleware de base
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/subscriptions', subscriptionRoutes);

// Gestion des erreurs
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Erreur non gérée:', err);
  res.status(500).json({
    success: false,
    message: 'Une erreur interne est survenue'
  });
});

export default app;