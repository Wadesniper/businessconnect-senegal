import type { JobData, Job, SavedJob, JobAlert, JobApplication, JobsResponse } from '../types/job';
import { api } from './api';

// Ce service ne gère plus de cache, la gestion des données est déléguée à React Query ou des hooks similaires.
export class JobService {
  static async getJobs(
    page: number = 1, 
    limit: number = 10, 
    search: string = '',
    sector: string | null = null,
    type: string | null = null,
    location: string | null = null,
  ): Promise<JobsResponse> {
    try {
      const response = await api.get<JobsResponse>('/api/jobs', {
        params: { page, limit, search, sector, type, location }
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des offres:', error.response?.data?.message || error.message);
      return { jobs: [], total: 0, page: 1, limit: 10 }; // Retourner une valeur par défaut
    }
  }

  static async getJobById(id: string): Promise<JobData | null> {
    try {
      const response = await api.get<JobData>(`/api/jobs/${id}`);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la récupération de l'offre ${id}:`, error.response?.data?.message || error.message);
      return null;
    }
  }

  static async createJob(jobData: Partial<JobData>): Promise<JobData> {
    try {
      // Ne jamais envoyer postedById côté client
      const { postedById, ...cleanJobData } = jobData;
      const response = await api.post<JobData>('/api/jobs', cleanJobData);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'offre:', error.response?.data?.message || error.message);
      throw error;
    }
  }

  static async updateJob(id: string, jobData: Partial<JobData>): Promise<JobData> {
    try {
      // Ne jamais envoyer postedById côté client
      const { postedById, ...cleanJobData } = jobData;
      const response = await api.put<JobData>(`/api/jobs/${id}`, cleanJobData);
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la mise à jour de l'offre ${id}:`, error.response?.data?.message || error.message);
      throw error;
    }
  }

  static async deleteJob(id: string): Promise<void> {
    try {
      await api.delete(`/api/jobs/${id}`);
    } catch (error: any) {
      console.error(`Erreur lors de la suppression de l'offre ${id}:`, error.response?.data?.message || error.message);
      throw error;
    }
  }

  static async applyToJob(jobId: string, cvUrl: string): Promise<JobApplication> {
    try {
      const response = await api.post<JobApplication>(`/api/jobs/${jobId}/apply`, { cvUrl });
      return response.data;
    } catch (error: any) {
      console.error(`Erreur lors de la candidature à l'offre ${jobId}:`, error.response?.data?.message || error.message);
      throw error;
    }
  }

  static async getMyApplications(): Promise<JobApplication[]> {
    try {
      const response = await api.get<JobApplication[]>('/api/jobs/my/applications');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de mes candidatures:', error.response?.data?.message || error.message);
      return [];
    }
  }

  static async getMyJobs(): Promise<JobData[]> {
    try {
      const response = await api.get<JobData[]>('/api/jobs/my-jobs');
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la récupération de mes offres:', error.response?.data?.message || error.message);
      return [];
    }
  }
}

// Service de gestion du localStorage pour les fonctionnalités non critiques
export class JobLocalStorageService {
  private getKey(key: string): string {
    return `businessconnect_${key}`;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
  
  getSavedJobs(userId: string): SavedJob[] {
    const data = localStorage.getItem(this.getKey(`saved_jobs_${userId}`));
    return data ? JSON.parse(data) : [];
  }

  saveJobToFavorites(userId: string, jobId: string): void {
    const savedJobs = this.getSavedJobs(userId);
    if (!savedJobs.some(job => job.jobId === jobId)) {
      const newSavedJob: SavedJob = {
        jobId,
        savedAt: new Date().toISOString(),
      };
      savedJobs.push(newSavedJob);
      localStorage.setItem(
        this.getKey(`saved_jobs_${userId}`),
        JSON.stringify(savedJobs)
      );
    }
  }

  removeJobFromFavorites(userId: string, jobId: string): void {
    const savedJobs = this.getSavedJobs(userId);
    const filteredJobs = savedJobs.filter(job => job.jobId !== jobId);
    localStorage.setItem(
      this.getKey(`saved_jobs_${userId}`),
      JSON.stringify(filteredJobs)
    );
  }

  // Les candidatures et alertes ne sont plus gérées en local.
}

export const jobService = new JobService();
export const localStorageService = new JobLocalStorageService(); 