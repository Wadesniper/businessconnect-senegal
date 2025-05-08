import { Job } from '../types/job';

class IndexedDBService {
  private dbName = 'businessconnect';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        reject(new Error('Erreur lors de l\'ouverture de la base de données'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store des offres d'emploi
        if (!db.objectStoreNames.contains('jobs')) {
          const jobStore = db.createObjectStore('jobs', { keyPath: 'id' });
          jobStore.createIndex('sector', 'sector', { unique: false });
          jobStore.createIndex('jobType', 'jobType', { unique: false });
          jobStore.createIndex('location', 'location', { unique: false });
          jobStore.createIndex('isActive', 'isActive', { unique: false });
        }

        // Store pour le cache des images
        if (!db.objectStoreNames.contains('imageCache')) {
          db.createObjectStore('imageCache', { keyPath: 'url' });
        }
      };
    });
  }

  async saveJobs(jobs: Job[]): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('jobs', 'readwrite');
      const store = transaction.objectStore('jobs');

      // Nettoyer le store avant d'ajouter les nouvelles offres
      store.clear();

      jobs.forEach(job => {
        store.add({
          ...job,
          timestamp: Date.now()
        });
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new Error('Erreur lors de la sauvegarde des offres'));
    });
  }

  async getJobs(): Promise<Job[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('jobs', 'readonly');
      const store = transaction.objectStore('jobs');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Erreur lors de la récupération des offres'));
      };
    });
  }

  async getJobById(id: string): Promise<Job | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('jobs', 'readonly');
      const store = transaction.objectStore('jobs');
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(new Error('Erreur lors de la récupération de l\'offre'));
      };
    });
  }

  async searchJobs(query: string): Promise<Job[]> {
    const jobs = await this.getJobs();
    const searchTerms = query.toLowerCase().split(' ');
    
    return jobs.filter(job => {
      const searchableText = `
        ${job.title} 
        ${job.company || ''} 
        ${job.location} 
        ${job.description} 
        ${job.keywords.join(' ')}
      `.toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  async filterJobs(filters: {
    sector?: string;
    jobType?: string;
    location?: string;
  }): Promise<Job[]> {
    if (!this.db) await this.init();

    const jobs = await this.getJobs();
    return jobs.filter(job => {
      if (filters.sector && job.sector !== filters.sector) return false;
      if (filters.jobType && job.jobType !== filters.jobType) return false;
      if (filters.location && !job.location.includes(filters.location)) return false;
      return true;
    });
  }

  // Cache des images
  async cacheImage(url: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('imageCache', 'readwrite');
      const store = transaction.objectStore('imageCache');
      const request = store.put({ url, blob, timestamp: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error('Erreur lors du cache de l\'image'));
    });
  }

  async getCachedImage(url: string): Promise<Blob | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('imageCache', 'readonly');
      const store = transaction.objectStore('imageCache');
      const request = store.get(url);

      request.onsuccess = () => {
        resolve(request.result ? request.result.blob : null);
      };

      request.onerror = () => {
        reject(new Error('Erreur lors de la récupération de l\'image du cache'));
      };
    });
  }

  async clearOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.init();

    const now = Date.now();
    const transaction = this.db!.transaction(['jobs', 'imageCache'], 'readwrite');
    
    // Nettoyer les vieilles offres
    const jobStore = transaction.objectStore('jobs');
    const jobs = await this.getJobs();
    jobs.forEach(job => {
      if (now - job.timestamp > maxAge) {
        jobStore.delete(job.id);
      }
    });

    // Nettoyer les vieilles images
    const imageStore = transaction.objectStore('imageCache');
    const images = await new Promise<any[]>((resolve) => {
      const request = imageStore.getAll();
      request.onsuccess = () => resolve(request.result);
    });

    images.forEach(image => {
      if (now - image.timestamp > maxAge) {
        imageStore.delete(image.url);
      }
    });
  }
}

export const indexedDBService = new IndexedDBService(); 