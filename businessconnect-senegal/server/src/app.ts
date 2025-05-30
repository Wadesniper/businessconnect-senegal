import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import webhookRoutes from './routes/webhook';
// import healthcheckRoutes from './routes/healthcheck';
import subscriptionsRoutes from './routes/subscriptions';
import usersRoutes from './routes/users';
import authRoutes from './routes/auth';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';

dotenv.config();

const app = express();

// Configuration CORS
app.use(cors({
  origin: '*',  // Accepter toutes les origines en développement
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Middleware de base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes publiques (pas besoin d'authentification)
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);

// Middleware d'authentification pour les routes protégées
app.use('/api/*', authenticate);

// Routes protégées (nécessitent une authentification)
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/users', usersRoutes);

// Error handling
app.use(errorHandler);

// Database connection
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;