import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import formationRoutes from './routes/formation';
import subscriptionRoutes from './routes/subscription';
import healthRoutes from './routes/health';

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Connexion à MongoDB
mongoose.connect(config.mongoUri)
  .then(() => {
    console.log('Connecté à MongoDB');
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Serveur démarré sur le port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  });

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error: Error) => {
  console.error('Erreur non gérée (Promise):', error);
  // Ne pas arrêter le serveur en production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

process.on('uncaughtException', (error: Error) => {
  console.error('Exception non capturée:', error);
  // Ne pas arrêter le serveur en production
  if (process.env.NODE_ENV !== 'production') {
    process.exit(1);
  }
});

export default app; 