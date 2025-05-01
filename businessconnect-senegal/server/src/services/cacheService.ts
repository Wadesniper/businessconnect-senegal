import { logger } from '../utils/logger';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private readonly defaultTTL: number = 5 * 60 * 1000; // 5 minutes
  private readonly maxSize: number = 10000; // Limite de 10000 items en cache
  private readonly cleanupInterval: number = 60 * 1000; // Nettoyage toutes les minutes

  private constructor() {
    this.cache = new Map();
    this.startCleanupInterval();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    // Si le cache est plein, supprimer les entrées les plus anciennes
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries());
      const oldestEntries = entries
        .sort((a, b) => a[1].timestamp - b[1].timestamp)
        .slice(0, Math.floor(this.maxSize * 0.1)); // Supprimer 10% des entrées les plus anciennes
      
      for (const [key] of oldestEntries) {
        this.cache.delete(key);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now > item.timestamp) {
          this.cache.delete(key);
        }
      }
      logger.debug(`Cache nettoyé. Taille actuelle: ${this.cache.size} items`);
    }, this.cleanupInterval);
  }

  // Méthodes utilitaires pour les patterns courants
  static async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cache = CacheService.getInstance();
    const cachedData = cache.get<T>(key);
    
    if (cachedData !== null) {
      return cachedData;
    }

    const data = await fetchFn();
    cache.set(key, data, ttl);
    return data;
  }

  getStats(): { size: number; memoryUsage: number } {
    const size = this.cache.size;
    // Estimation approximative de l'utilisation mémoire
    const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // En MB
    return { size, memoryUsage };
  }
} 