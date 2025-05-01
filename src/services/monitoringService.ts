import { logger } from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

export class StorageService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp');
  }

  async cleanupTempFiles(): Promise<void> {
    try {
      const files = await fs.readdir(this.tempDir);
      
      for (const file of files) {
        const filePath = path.join(this.tempDir, file);
        const stats = await fs.stat(filePath);
        
        // Supprime les fichiers de plus de 24h
        const fileAge = Date.now() - stats.mtime.getTime();
        if (fileAge > 24 * 60 * 60 * 1000) {
          await fs.unlink(filePath);
          logger.info(`Fichier temporaire supprimé: ${file}`);
        }
      }
    } catch (error) {
      logger.error('Erreur lors du nettoyage des fichiers temporaires:', error);
    }
  }
}

export class MonitoringService {
  private storage: StorageService;

  constructor() {
    this.storage = new StorageService();
  }

  async startMonitoring(): Promise<void> {
    // Nettoie les fichiers temporaires toutes les 6 heures
    setInterval(() => {
      this.storage.cleanupTempFiles();
    }, 6 * 60 * 60 * 1000);
  }
} 