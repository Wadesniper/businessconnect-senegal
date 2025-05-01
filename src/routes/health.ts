import { Router } from 'express';
import os from 'os';

const router = Router();

router.get('/health', (req, res) => {
  const healthData = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
      usage: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(2) + '%'
    },
    cpu: {
      cores: os.cpus().length,
      model: os.cpus()[0].model,
      load: os.loadavg()
    },
    platform: os.platform(),
    hostname: os.hostname(),
    status: 'healthy'
  };

  res.json(healthData);
});

export default router; 