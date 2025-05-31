import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';
import { createGzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import os from 'os';
import { createGunzip } from 'zlib';

const pipelineAsync = promisify(pipeline);

const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/data'  // Pour Railway
  : path.join(__dirname, '../../data');

const ARCHIVE_DIR = process.env.NODE_ENV === 'production'
  ? '/data/archives'
  : path.join(__dirname, '../../data/archives');

// Assurer que les répertoires existent
const ensureDirectories = async () => {
  const directories = [
    'users',
    'cvs',
    'formations',
    'jobs',
    'subscriptions',
    'archives'
  ];

  for (const dir of directories) {
    const dirPath = path.join(DATA_DIR, dir);
    await fs.mkdir(dirPath, { recursive: true });
  }
};

// Initialisation
ensureDirectories().catch(logger.error);

export class StorageService {
  static async save(collection: string, data: any): Promise<string> {
    const id = data.id || uuidv4();
    const filePath = path.join(DATA_DIR, collection, `${id}.json`);
    
    await fs.writeFile(filePath, JSON.stringify({
      ...data,
      id,
      updatedAt: new Date().toISOString()
    }, null, 2));

    return id;
  }

  static async get(collection: string, id: string): Promise<any> {
    const filePath = path.join(DATA_DIR, collection, `${id}.json`);
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  static async find(collection: string, query: Record<string, any> = {}): Promise<any[]> {
    const dirPath = path.join(DATA_DIR, collection);
    const files = await fs.readdir(dirPath);
    const results = [];

    for (const file of files) {
      if (path.extname(file) === '.json') {
        const data = await this.get(collection, path.parse(file).name);
        if (this.matchesQuery(data, query)) {
          results.push(data);
        }
      }
    }

    return results;
  }

  static async delete(collection: string, id: string): Promise<boolean> {
    const filePath = path.join(DATA_DIR, collection, `${id}.json`);
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return false;
      }
      throw error;
    }
  }

  static async update(collection: string, id: string, data: any): Promise<any> {
    const existing = await this.get(collection, id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...data,
      id,
      updatedAt: new Date().toISOString()
    };

    await this.save(collection, updated);
    return updated;
  }

  private static matchesQuery(data: any, query: Record<string, any>): boolean {
    return Object.entries(query).every(([key, value]) => {
      if (value instanceof RegExp) {
        return value.test(data[key]);
      }
      return data[key] === value;
    });
  }

  // Cache en mémoire pour les performances
  private static cache = new Map<string, any>();
  private static cacheTimeout = 5 * 60 * 1000; // 5 minutes

  static async getWithCache(collection: string, id: string): Promise<any> {
    const cacheKey = `${collection}:${id}`;
    
    if (this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < this.cacheTimeout) {
        return data;
      }
      this.cache.delete(cacheKey);
    }

    const data = await this.get(collection, id);
    if (data) {
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
    }

    return data;
  }

  static async archive(collection: string, id: string): Promise<boolean> {
    const sourcePath = path.join(DATA_DIR, collection, `${id}.json`);
    const archivePath = path.join(ARCHIVE_DIR, collection, `${id}.json.gz`);

    try {
      // Créer le répertoire d'archive si nécessaire
      await fs.mkdir(path.dirname(archivePath), { recursive: true });

      // Compresser et archiver le fichier
      const gzip = createGzip();
      const source = createReadStream(sourcePath);
      const destination = createWriteStream(archivePath);

      await pipelineAsync(source, gzip, destination);

      // Supprimer le fichier original
      await fs.unlink(sourcePath);

      logger.info(`Fichier archivé avec succès: ${collection}/${id}`);
      return true;
    } catch (error) {
      logger.error(`Erreur lors de l'archivage: ${collection}/${id}`, error);
      return false;
    }
  }

  static async getArchived(collection: string, id: string): Promise<any> {
    const archivePath = path.join(ARCHIVE_DIR, collection, `${id}.json.gz`);
    try {
      // Décompresser et lire le fichier
      const tempPath = path.join(os.tmpdir(), `bc-temp-${id}.json`);
      const gunzip = createGunzip();
      const source = createReadStream(archivePath);
      const destination = createWriteStream(tempPath);

      await pipelineAsync(source, gunzip, destination);

      // Lire le fichier temporaire
      const data = await fs.readFile(tempPath, 'utf-8');
      
      // Nettoyer
      await fs.unlink(tempPath);

      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  // Méthode pour obtenir les statistiques d'utilisation
  static async getStats(): Promise<StorageStats> {
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      collections: {} as Record<string, { files: number; size: number }>
    };

    const collections = ['users', 'cvs', 'formations', 'jobs', 'subscriptions'];

    for (const collection of collections) {
      const dirPath = path.join(DATA_DIR, collection);
      try {
        const files = await fs.readdir(dirPath);
        let collectionSize = 0;

        for (const file of files) {
          if (path.extname(file) === '.json') {
            const filePath = path.join(dirPath, file);
            const fileStats = await fs.stat(filePath);
            collectionSize += fileStats.size;
          }
        }

        stats.collections[collection] = {
          files: files.length,
          size: collectionSize
        };

        stats.totalFiles += files.length;
        stats.totalSize += collectionSize;
      } catch (error) {
        logger.error(`Erreur lors du calcul des stats pour ${collection}:`, error);
      }
    }

    return stats;
  }
}

interface StorageStats {
  totalFiles: number;
  totalSize: number;
  collections: Record<string, {
    files: number;
    size: number;
  }>;
} 