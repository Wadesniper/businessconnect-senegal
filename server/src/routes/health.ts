import { Router } from 'express';
import { RouteHandler } from '../types/custom.express.js';
import prisma from '../config/prisma.js'; // Importer l'instance partagée de Prisma

const router = Router();

const healthCheck: RouteHandler = async (_req, res) => {
  try {
    // Vérifier la connexion à la base de données via Prisma
    await prisma.$queryRaw`SELECT 1`;
    const dbStatus = { status: 'connected', connected: true };

    // Vérifier l'utilisation de la mémoire
    const memoryUsage = process.memoryUsage();
    
    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + 'MB',
        rss: Math.round(memoryUsage.rss / 1024 / 1024) + 'MB'
      }
    });
  } catch (error) {
    const dbStatus = { status: 'disconnected', connected: false, error: error instanceof Error ? error.message : 'Unknown error' };
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la vérification de santé',
      database: dbStatus,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

router.get('/', healthCheck);

export default router; 