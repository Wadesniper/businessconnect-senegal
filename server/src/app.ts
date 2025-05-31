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

// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration CORS simple pour la production
app.use(cors({
  origin: 'https://businessconnectsenegal2025gooo.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

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