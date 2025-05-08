import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import adRoutes from './routes/ads';
import paymentRoutes from './routes/payment';

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({
  origin: [
    'https://app.businessconnectsenegal.com',
    'https://businessconnect-senegal.onrender.com',
    /\.vercel\.app$/,
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null
  ].filter(Boolean),
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware d'erreur
app.use(errorHandler);

// Connexion à MongoDB et démarrage du serveur
const startServer = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement');
    }

    // Connexion MongoDB avec les options recommandées
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout après 5 secondes
      socketTimeoutMS: 45000, // Timeout socket après 45 secondes
    });
    logger.info('Connecté à MongoDB');

    // Démarrage du serveur avec gestion des erreurs de port
    const port = process.env.PORT || 5000;
    const server = app.listen(port, () => {
      logger.info(`Serveur démarré sur le port ${port}`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Le port ${port} est déjà utilisé. Arrêt du serveur.`);
        process.exit(1);
      } else {
        logger.error('Erreur lors du démarrage du serveur:', error);
        process.exit(1);
      }
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