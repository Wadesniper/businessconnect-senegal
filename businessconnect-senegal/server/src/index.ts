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
dotenv.config();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/auth', usersRoutes);
app.use('/api/jobs', jobsRouter);

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Connexion à MongoDB avec gestion d'erreur améliorée
mongoose.connect(config.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ Connecté à MongoDB avec succès');
  const port = config.PORT || 3001;
  app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur le port ${port}`);
  });
})
.catch((error) => {
  console.error('❌ Erreur de connexion à MongoDB:', error.message);
  process.exit(1);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error: Error) => {
  console.error('❌ Erreur non gérée:', error.message);
  process.exit(1);
});

export default app; 