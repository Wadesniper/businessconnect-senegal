import { JobData, JobApplication, JobAlert, SavedJob } from '../types/job';
import { localStorageService } from './localStorageService';

class JobService {
  // Gestion des offres d'emploi
  async getJobOffers(filters?: any): Promise<JobData[]> {
    // Cette fonction sera mise à jour avec les vraies offres d'emploi
    return [];
  }

  async getJobOffer(id: string): Promise<JobData | null> {
    const jobs = await this.getJobOffers();
    return jobs.find(job => job.id === id) || null;
  }

  // Gestion des candidatures
  async getUserApplications(userId: string): Promise<JobApplication[]> {
    return localStorageService.getJobApplications(userId);
  }

  async applyToJob(userId: string, jobId: string, application: Partial<JobApplication>): Promise<JobApplication> {
    const job = await this.getJobOffer(jobId);
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
    const job = await this.getJobOffer(jobId);
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