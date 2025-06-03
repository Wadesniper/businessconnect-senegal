import mongoose from 'mongoose';
import { config } from './index';
import { logger } from '../utils/logger'; // Supposant l'existence d'un logger

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('MongoDB Connected...');
  } catch (err: any) {
    logger.error('MongoDB Connection Error:', err.message);
    // Quitter le processus avec échec
    process.exit(1);
  }
};

export default connectDB; 