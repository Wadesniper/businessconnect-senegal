import { app } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { connectDB } from './utils/db';

const start = async () => {
  try {
    await connectDB();
    logger.info('Connexion à la base de données établie');

    const port = config.PORT || 3000;
    app.listen(port, () => {
      logger.info(`Serveur démarré sur le port ${port}`);
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

start(); 