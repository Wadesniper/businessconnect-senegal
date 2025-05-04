import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { config } from './config';
import authRoutes from './routes/auth';
import webhookRoutes from './routes/webhook';
import healthcheckRoutes from './routes/healthcheck';
import formationRoutes from './routes/formations';
import forumRoutes from './routes/forum';
import userRoutes from './routes/users';
import paymentRoutes from './routes/payments';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

dotenv.config();

const app = express();

// Configuration CORS
app.use(cors({
  origin: [
    config.CLIENT_URL,
    'https://businessconnect-senegal.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/healthcheck', healthcheckRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// Error handling
app.use(errorHandler);

// Database connection
mongoose
  .connect(config.DATABASE_URL)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;