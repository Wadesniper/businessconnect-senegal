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
  private readonly storageService: StorageService;

  private constructor() {
    this.storageService = new StorageService();
    this.startMonitoring();
  }

  public static getInstance(): MonitoringService {
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
    const diskSpace = await this.checkDiskSpace(process.env.NODE_ENV === 'production' ? '/data' : './data');

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
    if (metrics.memoryUsage > this.memoryThreshold) {
      logger.warn('Usage mémoire élevé, nettoyage du cache...');
      await this.optimizeMemory();
    }

    if (metrics.cpuUsage > this.cpuThreshold) {
      logger.warn('Usage CPU élevé, optimisation des processus...');
      await this.optimizeCPU();
    }

    if (metrics.diskUsage > this.diskThreshold) {
      logger.warn('Espace disque faible, nettoyage...');
      await this.optimizeDiskSpace();
    }
  }

  private async optimizeMemory(): Promise<void> {
    const cacheService = CacheService.getInstance();
    await cacheService.clear();
  }

  private async optimizeCPU(): Promise<void> {
    // Implémentation de l'optimisation CPU si nécessaire
  }

  private async optimizeDiskSpace(): Promise<void> {
    await this.storageService.cleanupTempFiles();
  }

  private logMetrics(metrics: SystemMetrics): void {
    logger.info('Métriques système:', {
      memoryUsage: `${(metrics.memoryUsage * 100).toFixed(2)}%`,
      cpuUsage: `${(metrics.cpuUsage * 100).toFixed(2)}%`,
      diskUsage: `${(metrics.diskUsage * 100).toFixed(2)}%`,
      cacheSize: `${metrics.cacheSize} items`,
      cacheMemoryUsage: `${(metrics.cacheMemoryUsage / 1024 / 1024).toFixed(2)} MB`
    });
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
}

interface SystemMetrics {
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  cacheSize: number;
  cacheMemoryUsage: number;
  timestamp: string;
} 