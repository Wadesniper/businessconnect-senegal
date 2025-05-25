import type { Job, JobApplication, JobAlert, SavedJob } from '../types/job';
import { localStorageService } from './localStorageService';
import { indexedDBService } from './indexedDBService';
import { endpoints } from '../config/api';

// Cache local pour les offres d'emploi
class LocalJobStorage {
  private static KEY = 'businessconnect_jobs';
  private static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

  static saveJobs(jobs: Job[]): void {
    const data = {
      jobs,
      timestamp: Date.now()
    };
    localStorage.setItem(this.KEY, JSON.stringify(data));
  }

  static getJobs(): Job[] | null {
    const data = localStorage.getItem(this.KEY);
    if (!data) return null;

    const { jobs, timestamp } = JSON.parse(data);
    if (Date.now() - timestamp > this.CACHE_DURATION) {
      localStorage.removeItem(this.KEY);
      return null;
    }

    return jobs;
  }

  static addJob(job: Job): void {
    const jobs = this.getJobs() || [];
    jobs.push(job);
    this.saveJobs(jobs);
  }

  static updateJob(updatedJob: Job): void {
    const jobs = this.getJobs() || [];
    const index = jobs.findIndex(job => job.id === updatedJob.id);
    if (index !== -1) {
      jobs[index] = updatedJob;
      this.saveJobs(jobs);
    }
  }

  static deleteJob(jobId: string): void {
    const jobs = this.getJobs() || [];
    const filteredJobs = jobs.filter(job => job.id !== jobId);
    this.saveJobs(filteredJobs);
  }
}

export class JobService {
  // Gestion des offres d'emploi
  static async getJobs(): Promise<Job[]> {
    try {
      const response = await fetch(endpoints.jobs);
      if (!response.ok) {
        throw new Error('Erreur réseau');
      }
      let jobs = await response.json();
      jobs = (jobs || []).map((job: any) => ({
        ...job,
        id: job._id || job.id,
        type: job.jobType || job.type || '',
        sector: job.sector || '',
        location: job.location || '',
      }));
      console.log('Jobs reçus pour affichage (après mapping):', jobs);
      await indexedDBService.saveJobs(jobs);
      return jobs;
    } catch (error) {
      console.warn('Erreur lors de la récupération des offres depuis l\'API, fallback sur le cache IndexedDB:', error);
      let jobs = await indexedDBService.getJobs() || [];
      jobs = (jobs || []).map((job: any) => ({
        ...job,
        id: job._id || job.id,
        type: job.jobType || job.type || '',
        sector: job.sector || '',
        location: job.location || '',
      }));
      console.log('Jobs reçus depuis le cache (après mapping):', jobs);
      return jobs;
    }
  }

  static async getJobById(id: string): Promise<Job | null> {
    try {
      let job = await indexedDBService.getJobById(id);
      if (!job) {
        const response = await fetch(`/api/jobs/${id}`);
        if (!response.ok) {
          throw new Error('Erreur réseau');
        }
        job = await response.json();
      }
      if (job) {
        job.id = job._id || job.id;
      }
      return job;
    } catch (error) {
      console.warn('Erreur lors de la récupération de l\'offre:', error);
      return null;
    }
  }

  static async searchJobs(query: string): Promise<Job[]> {
    try {
      // Essayer d'abord la recherche locale
      return await indexedDBService.searchJobs(query);
    } catch (error) {
      console.warn('Erreur lors de la recherche des offres:', error);
      return [];
    }
  }

  static async filterJobs(filters: {
    sector?: string;
    jobType?: string;
    location?: string;
  }): Promise<Job[]> {
    try {
      // Utiliser le filtrage local
      return await indexedDBService.filterJobs(filters);
    } catch (error) {
      console.warn('Erreur lors du filtrage des offres:', error);
      return [];
    }
  }

  static async createJob(jobData: Partial<Job>): Promise<Job> {
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'offre');
      }

      let newJob = await response.json();
      newJob.id = newJob._id || newJob.id;
      const jobs = await indexedDBService.getJobs();
      await indexedDBService.saveJobs([...(jobs || []), newJob]);
      return newJob;
    } catch (error) {
      console.error('Erreur lors de la création de l\'offre:', error);
      throw error;
    }
  }

  static async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'offre');
      }

      let updatedJob = await response.json();
      updatedJob.id = updatedJob._id || updatedJob.id;
      const jobs = await indexedDBService.getJobs();
      const updatedJobs = (jobs || []).map(job => 
        job.id === id ? updatedJob : job
      );
      await indexedDBService.saveJobs(updatedJobs);
      return updatedJob;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'offre:', error);
      throw error;
    }
  }

  static async deleteJob(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'offre');
      }

      // Mettre à jour le cache
      const jobs = await indexedDBService.getJobs();
      const updatedJobs = jobs.filter(job => job.id !== id);
      await indexedDBService.saveJobs(updatedJobs);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'offre:', error);
      throw error;
    }
  }

  // Gestion des candidatures
  async getUserApplications(userId: string): Promise<JobApplication[]> {
    return localStorageService.getJobApplications(userId);
  }

  async applyToJob(userId: string, jobId: string, application: Partial<JobApplication>): Promise<JobApplication> {
    const job = await JobService.getJobById(jobId);
    if (!job) {
      throw new Error('Offre d\'emploi non trouvée');
    }

    const newApplication: JobApplication = {
      id: localStorageService.generateId(),
      userId,
      jobId,
      jobTitle: job.title,
      company: job.company,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...application
    };

    localStorageService.saveJobApplication(newApplication);
    return newApplication;
  }

  // Gestion des offres sauvegardées
  async getSavedJobs(userId: string): Promise<SavedJob[]> {
    return localStorageService.getSavedJobs(userId);
  }

  async saveJob(userId: string, jobId: string): Promise<SavedJob> {
    const job = await JobService.getJobById(jobId);
    if (!job) {
      throw new Error('Offre d\'emploi non trouvée');
    }

    const savedJob: SavedJob = {
      id: localStorageService.generateId(),
      userId,
      jobId,
      job,
      savedAt: new Date().toISOString()
    };

    localStorageService.saveJobToFavorites(savedJob);
    return savedJob;
  }

  // Gestion des alertes emploi
  async getJobAlerts(userId: string): Promise<JobAlert[]> {
    return localStorageService.getJobAlerts(userId);
  }

  async createJobAlert(userId: string, alert: Partial<JobAlert>): Promise<JobAlert> {
    const newAlert: JobAlert = {
      id: localStorageService.generateId(),
      userId,
      keywords: alert.keywords || [],
      locations: alert.locations || [],
      jobTypes: alert.jobTypes || [],
      salary: alert.salary,
      frequency: alert.frequency || 'daily',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localStorageService.saveJobAlert(newAlert);
    return newAlert;
  }
}

export const jobService = new JobService(); 