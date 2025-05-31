import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook';
import subscriptionsRoutes from './routes/subscriptions';
import usersRoutes from './routes/users';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';

dotenv.config();

const app = express();

// Configuration CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://app.businessconnectsenegal.com',
    'https://businessconnect-senegal.vercel.app',
    'https://businessconnect-senegal-api-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques (pas besoin d'authentification)
app.use('/auth', authRoutes);
app.use('/webhooks', webhookRoutes);

// Middleware d'authentification pour les routes protégées
app.use('/subscriptions', authenticate, subscriptionsRoutes);
app.use('/users', authenticate, usersRoutes);

// Route de test pour vérifier que l'API fonctionne
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API BusinessConnect en ligne' });
});

// Middleware de gestion des erreurs
app.use(errorHandler);

// Connexion à la base de données
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });
}

export default app;