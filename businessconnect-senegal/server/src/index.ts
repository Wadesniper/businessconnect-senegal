import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import jobRoutes from './routes/job';
import subscriptionRoutes from './routes/subscription';
import marketplaceRoutes from './routes/marketplace';
import { forumRouter } from './routes/forum';
import cartRoutes from './routes/cart';
import formationRoutes from './routes/formations';
import { healthRouter } from './routes/health';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/forum', forumRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/formations', formationRoutes);

// Error handling
app.use(errorHandler);

// Test database connection
const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    logger.info('Connexion à PostgreSQL établie avec succès');
    client.release();
    return true;
  } catch (error) {
    logger.error('Erreur de connexion à PostgreSQL:', error);
    return false;
  }
};

// Start server
const startServer = async () => {
  try {
    const isDbConnected = await testDbConnection();
    if (!isDbConnected) {
      throw new Error('Impossible de se connecter à la base de données');
    }

    app.listen(port, () => {
      logger.info(`Serveur démarré sur le port ${port}`);
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

startServer(); 