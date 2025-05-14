// Service pour la gestion locale des offres d'emploi avec IndexedDB
const DB_NAME = 'BusinessConnectDB';
const STORE_NAME = 'jobs';
const DB_VERSION = 1;

function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

export const indexedDBService = {
  async getJobs() {
    const db = await openDB();
    return new Promise<any[]>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  async saveJobs(jobs: any[]) {
    const db = await openDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      jobs.forEach(job => store.put(job));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
  async getJobById(id: string) {
    const db = await openDB();
    return new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  async searchJobs(query: string) {
    const jobs = await this.getJobs();
    return jobs.filter((job: any) =>
      job.title?.toLowerCase().includes(query.toLowerCase()) ||
      job.company?.toLowerCase().includes(query.toLowerCase())
    );
  },
  async filterJobs(filters: any) {
    const jobs = await this.getJobs();
    // Filtrage simple, à adapter selon la structure des jobs et des filtres
    return jobs.filter((job: any) => {
      let match = true;
      if (filters.type && job.type !== filters.type) match = false;
      if (filters.sector && job.sector !== filters.sector) match = false;
      if (filters.location && job.location !== filters.location) match = false;
      return match;
    });
  }
}; 