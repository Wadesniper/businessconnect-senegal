import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../config';

const router = Router();
const pool = new Pool({ connectionString: config.DATABASE_URL });

router.get('/', async (_req, res) => {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      database: false,
      server: true
    };

    // Vérifier la base de données
    try {
      await pool.query('SELECT NOW()');
      status.database = true;
    } catch (error) {
      console.error('Erreur DB:', error);
    }

    // Déterminer le statut global
    const isHealthy = status.database && status.server;

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      ...status
    });
  } catch (error) {
    console.error('Erreur healthcheck:', error);
    res.status(500).json({ status: 'error', error: error.message });
  }
});

export default router; 