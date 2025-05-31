import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook';
import subscriptionsRoutes from './routes/subscriptions';
import usersRoutes from './routes/users';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Configuration CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://businessconnect-senegal.vercel.app',
    'https://businessconnect-senegal-api-production.up.railway.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware pour parser le JSON
app.use(express.json());

// Routes publiques (pas besoin d'authentification)
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);

// Routes protégées (nécessitent une authentification)
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/users', usersRoutes);

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