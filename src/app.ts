import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimiter from './middlewares/rateLimiter';
import type { RateLimitRequestHandler } from 'express-rate-limit';
import authRoutes from './routes/auth';
import { authMiddleware } from './middleware/authMiddleware';

const app: Express = express();

// Middlewares de sécurité et d'optimisation
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration du rate limiter
app.use('/', rateLimiter as RateLimitRequestHandler);

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/*', authMiddleware.auth);

export default app; 