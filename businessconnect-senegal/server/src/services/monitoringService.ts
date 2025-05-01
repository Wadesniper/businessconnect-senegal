import { CacheService } from './cacheService';
import { StorageService } from './storageService';
import { logger } from '../utils/logger';
import os from 'os';
import fs from 'fs/promises';

export class MonitoringService {
  private static instance: MonitoringService;
  private readonly checkInterval = 30000; // 30 secondes
  private readonly memoryThreshold = 0.85; // 85% d'utilisation mémoire
  private readonly diskThreshold = 0.80; // 80% d'utilisation disque
  private readonly cpuThreshold = 0.70; // 70% d'utilisation CPU

  private constructor() {
    this.startMonitoring();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private async startMonitoring(): Promise<void> {
    setInterval(async () => {
      try {
        const metrics = await this.collectMetrics();
        await this.handleMetrics(metrics);
        this.logMetrics(metrics);
      } catch (error) {
        logger.error('Erreur lors du monitoring:', error);
      }
    }, this.checkInterval);
  }

  private async collectMetrics(): Promise<SystemMetrics> {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsage = (totalMemory - freeMemory) / totalMemory;

    const cpuUsage = os.loadavg()[0] / os.cpus().length;
    
    const cacheStats = CacheService.getInstance().getStats();
    
    // Vérifier l'espace disque
    const dataDir = process.env.NODE_ENV === 'production' ? '/data' : './data';
    const diskSpace = await this.checkDiskSpace(dataDir);

    return {
      memoryUsage,
      cpuUsage,
      diskUsage: diskSpace.usage,
      cacheSize: cacheStats.size,
      cacheMemoryUsage: cacheStats.memoryUsage,
      timestamp: new Date().toISOString()
    };
  }

  private async handleMetrics(metrics: SystemMetrics): Promise<void> {
    const cache = CacheService.getInstance();

    // Gestion de la mémoire
    if (metrics.memoryUsage > this.memoryThreshold) {
      logger.warn('Usage mémoire élevé, nettoyage du cache...');
      await this.optimizeMemory(metrics);
    }

    // Gestion du CPU
    if (metrics.cpuUsage > this.cpuThreshold) {
      logger.warn('Usage CPU élevé, optimisation des processus...');
      await this.optimizeCPU(metrics);
    }

    // Gestion du disque
    if (metrics.diskUsage > this.diskThreshold) {
      logger.warn('Espace disque faible, nettoyage...');
      await this.optimizeDiskSpace();
    }
  }

  private async optimizeMemory(metrics: SystemMetrics): Promise<void> {
    const cache = CacheService.getInstance();
    
    // Réduire la taille du cache si nécessaire
    if (metrics.cacheSize > 8000) { // Si plus de 8000 items en cache
      const entriesToRemove = Math.floor(metrics.cacheSize * 0.2); // Supprimer 20%
      cache.clear();
      logger.info(`Cache réduit, ${entriesToRemove} entrées supprimées`);
    }

    // Forcer le garbage collector si disponible
    if (global.gc) {
      global.gc();
      logger.info('Garbage collection forcée');
    }
  }

  private async optimizeCPU(metrics: SystemMetrics): Promise<void> {
    const cache = CacheService.getInstance();
    // Réduire les opérations en arrière-plan
    if (metrics.cpuUsage > 0.9) { // Si CPU > 90%
      // Augmenter les intervalles de nettoyage
      cache.setCleanupInterval(120000); // 2 minutes
      logger.info('Intervalles de nettoyage augmentés');
    } else {
      cache.setCleanupInterval(60000); // Retour à 1 minute
    }
  }

  private async optimizeDiskSpace(): Promise<void> {
    try {
      // Nettoyer les fichiers temporaires
      const tempDir = os.tmpdir();
      const files = await fs.readdir(tempDir);
      for (const file of files) {
        if (file.startsWith('bc-temp-')) {
          await fs.unlink(`${tempDir}/${file}`);
        }
      }

      // Archiver les vieux fichiers
      await this.archiveOldFiles();

      logger.info('Nettoyage du disque effectué');
    } catch (error) {
      logger.error('Erreur lors du nettoyage du disque:', error);
    }
  }

  private async archiveOldFiles(): Promise<void> {
    const collections = ['cvs', 'formations', 'jobs'];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    for (const collection of collections) {
      const files = await StorageService.find(collection, {
        updatedAt: { $lt: thirtyDaysAgo.toISOString() }
      });

      for (const file of files) {
        // Archiver dans un stockage moins coûteux ou supprimer si déjà archivé
        await StorageService.archive(collection, file.id);
      }
    }
  }

  private async checkDiskSpace(path: string): Promise<{ total: number; free: number; usage: number }> {
    try {
      const stats = await fs.statfs(path);
      const total = stats.blocks * stats.bsize;
      const free = stats.bfree * stats.bsize;
      const usage = (total - free) / total;
      return { total, free, usage };
    } catch (error) {
      logger.error('Erreur lors de la vérification de l\'espace disque:', error);
      return { total: 0, free: 0, usage: 0 };
    }
  }

  private logMetrics(metrics: SystemMetrics): void {
    logger.info('Métriques système:', {
      memoryUsage: `${(metrics.memoryUsage * 100).toFixed(2)}%`,
      cpuUsage: `${(metrics.cpuUsage * 100).toFixed(2)}%`,
      diskUsage: `${(metrics.diskUsage * 100).toFixed(2)}%`,
      cacheSize: metrics.cacheSize,
      cacheMemoryUsage: `${metrics.cacheMemoryUsage.toFixed(2)}MB`
    });
  }
}

interface SystemMetrics {
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  cacheSize: number;
  cacheMemoryUsage: number;
  timestamp: string;
} 