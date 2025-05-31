import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';
import userRoutes from './routes/user';
import formationRoutes from './routes/formations';
import healthRoutes from './routes/health';
import usersRoutes from './routes/users';
import dotenv from 'dotenv';
import { config } from './config';
import jobsRouter from './routes/jobs';
import subscriptionsRoutes from './routes/subscriptions';
import authRoutes from './routes/auth';
// import adminRoutes from './routes/admin.routes';
dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());

// Configuration CORS pour la production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://businessconnectsenegal2025gooo.vercel.app']
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Parser pour le JSON et les URL encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/jobs', jobsRouter);
app.use('/api/formations', formationRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
// app.use('/api/admin', adminRoutes);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Connexion à MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1);
  });

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error: Error) => {
  console.error('❌ Erreur non gérée:', error.message);
  process.exit(1);
});

export default app; 