import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import userRoutes from './routes/user.js';
import formationRoutes from './routes/formations.js';
import healthRoutes from './routes/health.js';
import usersRoutes from './routes/users.js';
import dotenv from 'dotenv';
import { config } from './config.js';
import jobsRouter from './routes/jobs.js';
import subscriptionsRoutes from './routes/subscriptions.js';
import authRoutes from './routes/auth.js';
import routes from './routes/index.js';
import { logger } from './utils/logger.js';
// import adminRoutes from './routes/admin.routes.js';
dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());

// Middleware de logging
app.use(morgan('dev'));

// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration CORS
app.use(cors({
  origin: [
    'https://businessconnectsenegal.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));

// Middleware de limitation de requêtes
app.use(rateLimiter);

// Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/jobs', jobsRouter);
app.use('/api/formations', formationRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/health', healthRoutes);
// app.use('/api/admin', adminRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error: Error) => {
  logger.error('❌ Erreur non gérée:', error.message);
  process.exit(1);
});

// Connexion à MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(async () => {
    logger.info('Connecté à MongoDB');
    try {
      const test = await import('./config/prisma.js');
      await test.default.$connect();
      logger.info('Connecté à Supabase (Prisma)');
    } catch (e) {
      logger.error('Erreur de connexion à Supabase (Prisma):', e);
    }
    // Démarrer le serveur une fois connecté à MongoDB
    const PORT = config.PORT || 3000;
    app.listen(PORT, () => {
      logger.info(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  });

export default app; 