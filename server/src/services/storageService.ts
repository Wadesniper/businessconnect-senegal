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
import { Storage } from '@google-cloud/storage';
import { config } from '../config';

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
  private storage: Storage;
  private bucket: string;
  private static instance: StorageService;

  constructor() {
    this.storage = new Storage({
      projectId: config.GOOGLE_CLOUD_PROJECT_ID,
      credentials: {
        client_email: config.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: config.GOOGLE_CLOUD_PRIVATE_KEY
      }
    });
    this.bucket = config.GOOGLE_CLOUD_STORAGE_BUCKET;
  }

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  async uploadFile(file: Express.Multer.File, destination: string): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const blob = bucket.file(destination);
      
      await blob.save(file.buffer, {
        contentType: file.mimetype,
        metadata: {
          originalname: file.originalname
        }
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucket}/${destination}`;
      return publicUrl;
    } catch (error) {
      logger.error('Erreur lors du téléchargement du fichier:', error);
      throw new Error('Erreur lors du téléchargement du fichier');
    }
  }

  async list<T extends Record<string, unknown>>(collection: string, query: Partial<T> = {}): Promise<T[]> {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const [files] = await bucket.getFiles({ prefix: `${collection}/` });
      const results: T[] = [];

      for (const file of files) {
        const [content] = await file.download();
        const data = JSON.parse(content.toString()) as T;
        
        const matches = Object.entries(query).every(([key, value]) => {
          return data[key as keyof T] === value;
        });

        if (matches) {
          results.push(data);
        }
      }

      return results;
    } catch (error) {
      logger.error('Erreur lors de la liste des documents:', error);
      throw new Error('Erreur lors de la liste des documents');
    }
  }

  async save<T extends { id: string }>(collection: string, data: T): Promise<T> {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const blob = bucket.file(`${collection}/${data.id}.json`);
      
      await blob.save(JSON.stringify(data, null, 2), {
        contentType: 'application/json'
      });

      return data;
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde:', error);
      throw new Error('Erreur lors de la sauvegarde');
    }
  }

  async update<T extends { id: string }>(collection: string, id: string, data: Partial<T>): Promise<T> {
    try {
      const bucket = this.storage.bucket(this.bucket);
      const blob = bucket.file(`${collection}/${id}.json`);
      const [content] = await blob.download();
      const existingData = JSON.parse(content.toString()) as T;
      
      const updated = {
        ...existingData,
        ...data,
        updatedAt: new Date()
      } as T;

      await blob.save(JSON.stringify(updated, null, 2), {
        contentType: 'application/json'
      });

      return updated;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour:', error);
      throw new Error('Erreur lors de la mise à jour');
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      await this.storage.bucket(this.bucket).file(filename).delete();
    } catch (error) {
      logger.error('Erreur lors de la suppression du fichier:', error);
      throw new Error('Erreur lors de la suppression du fichier');
    }
  }

  // Méthodes statiques pour la compatibilité
  static async get<T>(collection: string, id: string): Promise<T | null> {
    try {
      const instance = StorageService.getInstance();
      const bucket = instance.storage.bucket(instance.bucket);
      const blob = bucket.file(`${collection}/${id}.json`);
      
      try {
        const [content] = await blob.download();
        return JSON.parse(content.toString()) as T;
      } catch (error) {
        if ((error as any).code === 404) {
          return null;
        }
        throw error;
      }
    } catch (error) {
      logger.error('Erreur lors de la récupération:', error);
      return null;
    }
  }

  static async find<T extends Record<string, unknown>>(collection: string, query: Partial<T> = {}): Promise<T[]> {
    const instance = StorageService.getInstance();
    return instance.list<T>(collection, query);
  }

  static async save<T extends { id: string }>(collection: string, data: T): Promise<T> {
    const instance = StorageService.getInstance();
    return instance.save(collection, data);
  }

  static async update<T extends { id: string }>(collection: string, id: string, data: Partial<T>): Promise<T | null> {
    const instance = StorageService.getInstance();
    return instance.update(collection, id, data);
  }

  static async delete(collection: string, id: string): Promise<boolean> {
    try {
      const instance = StorageService.getInstance();
      await instance.deleteFile(`${collection}/${id}.json`);
      return true;
    } catch (error) {
      if ((error as any).code === 404) {
        return false;
      }
      throw error;
    }
  }

  static async archive(collection: string, id: string): Promise<boolean> {
    try {
      const instance = StorageService.getInstance();
      const bucket = instance.storage.bucket(instance.bucket);
      const sourceBlob = bucket.file(`${collection}/${id}.json`);
      const archiveBlob = bucket.file(`archives/${collection}/${id}.json.gz`);

      const [content] = await sourceBlob.download();
      const gzip = createGzip();
      
      const tempPath = path.join(os.tmpdir(), `bc-temp-${id}.json.gz`);
      await pipelineAsync(
        Buffer.from(content),
        gzip,
        createWriteStream(tempPath)
      );

      await archiveBlob.save(await fs.readFile(tempPath), {
        contentType: 'application/gzip'
      });

      await sourceBlob.delete();
      await fs.unlink(tempPath);

      return true;
    } catch (error) {
      logger.error('Erreur lors de l\'archivage:', error);
      return false;
    }
  }

  static async getArchived<T>(collection: string, id: string): Promise<T | null> {
    try {
      const instance = StorageService.getInstance();
      const bucket = instance.storage.bucket(instance.bucket);
      const archiveBlob = bucket.file(`archives/${collection}/${id}.json.gz`);

      const [content] = await archiveBlob.download();
      const tempPath = path.join(os.tmpdir(), `bc-temp-${id}.json`);
      
      await pipelineAsync(
        Buffer.from(content),
        createGunzip(),
        createWriteStream(tempPath)
      );

      const data = await fs.readFile(tempPath, 'utf-8');
      await fs.unlink(tempPath);

      return JSON.parse(data) as T;
    } catch (error) {
      if ((error as any).code === 404) {
        return null;
      }
      logger.error('Erreur lors de la récupération de l\'archive:', error);
      return null;
    }
  }

  static async getStats(): Promise<StorageStats> {
    try {
      const instance = StorageService.getInstance();
      const bucket = instance.storage.bucket(instance.bucket);
      const [files] = await bucket.getFiles();

      const stats: StorageStats = {
        totalFiles: 0,
        totalSize: 0,
        collections: {}
      };

      for (const file of files) {
        const [metadata] = await file.getMetadata();
        const collection = file.name.split('/')[0];
        const size = typeof metadata.size === 'string' ? parseInt(metadata.size) : (metadata.size || 0);
        
        if (!stats.collections[collection]) {
          stats.collections[collection] = {
            files: 0,
            size: 0
          };
        }

        stats.collections[collection].files++;
        stats.collections[collection].size += size;
        stats.totalFiles++;
        stats.totalSize += size;
      }

      return stats;
    } catch (error) {
      logger.error('Erreur lors du calcul des statistiques:', error);
      throw new Error('Erreur lors du calcul des statistiques');
    }
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