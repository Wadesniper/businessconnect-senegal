import { Router } from 'express';
import { Pool } from 'pg';
import { config } from '../config';
import axios from 'axios';

const router = Router();
const pool = new Pool({ connectionString: config.DATABASE_URL });

router.get('/', async (req, res) => {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      database: false,
      paytech: false,
      server: true
    };

    // Vérifier la base de données
    try {
      await pool.query('SELECT NOW()');
      status.database = true;
    } catch (error) {
      console.error('Erreur DB:', error);
    }

    // Vérifier PayTech
    try {
      const response = await axios.get(`${config.PAYTECH_BASE_URL}/status`, {
        headers: { 'Authorization': `Bearer ${config.PAYTECH_API_KEY}` }
      });
      status.paytech = response.status === 200;
    } catch (error) {
      console.error('Erreur PayTech:', error);
    }

    // Déterminer le statut global
    const isHealthy = status.database && status.paytech && status.server;

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