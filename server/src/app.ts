import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import userRoutes from './routes/user.js';
import formationRoutes from './routes/formations.js';
import healthRoutes from './routes/health.js';
import usersRoutes from './routes/users.js';
import jobsRouter from './routes/jobs.js';
import subscriptionsRoutes from './routes/subscriptions.js';
import authRoutes from './routes/auth.js';
import routes from './routes/index.js';

const app = express();

// Middleware de sécurité
app.use(helmet());
// Middleware de logging
app.use(morgan('dev'));
// Middleware pour parser le JSON et les formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configuration CORS
app.use(cors({
  origin: '*', // TEMPORAIRE pour debug CORS, à restreindre ensuite
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin']
}));
// Middleware de limitation de requêtes
app.use(rateLimiter);
// Routes
app.use('/api', routes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/jobs', jobsRouter);
app.use('/api/formations', formationRoutes);
app.use('/api/subscriptions', subscriptionsRoutes);
app.use('/api/health', healthRoutes);
// Middleware de gestion d'erreurs
app.use(errorHandler);

// Endpoint healthcheck Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app; 