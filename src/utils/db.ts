import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from './logger';

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    } as mongoose.ConnectOptions);
  } catch (error) {
    logger.error('Erreur de connexion à MongoDB:', error);
    throw error;
  }
}; 