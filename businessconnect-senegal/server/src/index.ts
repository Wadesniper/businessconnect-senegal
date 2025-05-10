import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: [config.CLIENT_URL, /\.vercel\.app$/],
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authApi').default;
const jobsRoutes = require('./routes/jobs').default;
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobsRoutes);

// Middleware d'erreur
app.use(errorHandler);

// Connexion à MongoDB et démarrage du serveur
const startServer = async () => {
  try {
    // Vérifier si le port est déjà utilisé
    const server = app.listen(config.PORT);
    
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Le port ${config.PORT} est déjà utilisé. Tentative avec le port ${config.PORT + 1}`);
        server.close();
        // Essayer avec le port suivant
        app.listen(config.PORT + 1, () => {
          logger.info(`Serveur démarré sur le port ${config.PORT + 1}`);
        });
      } else {
        logger.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
      }
    });

    // Connexion MongoDB
    await mongoose.connect(config.DATABASE_URL);
    logger.info('Connecté à MongoDB');
    
    server.on('listening', () => {
      logger.info(`Serveur démarré sur le port ${config.PORT}`);
    });

  } catch (error) {
    logger.error('Erreur de connexion à la base de données:', error);
    process.exit(1);
  }
};

startServer();

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error: Error) => {
  logger.error('Erreur non gérée (Promise):', error);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Exception non capturée:', error);
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

export default app; 