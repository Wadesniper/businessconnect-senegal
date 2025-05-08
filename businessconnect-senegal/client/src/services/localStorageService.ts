import { JobApplication, SavedJob, JobAlert } from '../types/job';

class LocalStorageService {
  private static PREFIX = 'businessconnect_';

  private getKey(key: string): string {
    return `${LocalStorageService.PREFIX}${key}`;
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Applications aux offres d'emploi
  getJobApplications(userId: string): JobApplication[] {
    const key = this.getKey(`applications_${userId}`);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveJobApplication(application: JobApplication): void {
    const applications = this.getJobApplications(application.userId);
    applications.push(application);
    localStorage.setItem(
      this.getKey(`applications_${application.userId}`),
      JSON.stringify(applications)
    );
  }

  // Offres sauvegardées
  getSavedJobs(userId: string): SavedJob[] {
    const key = this.getKey(`saved_jobs_${userId}`);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveJobToFavorites(savedJob: SavedJob): void {
    const savedJobs = this.getSavedJobs(savedJob.userId);
    // Éviter les doublons
    const index = savedJobs.findIndex(job => job.jobId === savedJob.jobId);
    if (index === -1) {
      savedJobs.push(savedJob);
      localStorage.setItem(
        this.getKey(`saved_jobs_${savedJob.userId}`),
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

  // Alertes emploi
  getJobAlerts(userId: string): JobAlert[] {
    const key = this.getKey(`alerts_${userId}`);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  saveJobAlert(alert: JobAlert): void {
    const alerts = this.getJobAlerts(alert.userId);
    alerts.push(alert);
    localStorage.setItem(
      this.getKey(`alerts_${alert.userId}`),
      JSON.stringify(alerts)
    );
  }

  updateJobAlert(alert: JobAlert): void {
    const alerts = this.getJobAlerts(alert.userId);
    const index = alerts.findIndex(a => a.id === alert.id);
    if (index !== -1) {
      alerts[index] = alert;
      localStorage.setItem(
        this.getKey(`alerts_${alert.userId}`),
        JSON.stringify(alerts)
      );
    }
  }

  deleteJobAlert(userId: string, alertId: string): void {
    const alerts = this.getJobAlerts(userId);
    const filteredAlerts = alerts.filter(alert => alert.id !== alertId);
    localStorage.setItem(
      this.getKey(`alerts_${userId}`),
      JSON.stringify(filteredAlerts)
    );
  }

  // Gestion du cache
  clearUserData(userId: string): void {
    localStorage.removeItem(this.getKey(`applications_${userId}`));
    localStorage.removeItem(this.getKey(`saved_jobs_${userId}`));
    localStorage.removeItem(this.getKey(`alerts_${userId}`));
  }

  clearAllData(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(LocalStorageService.PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}

export const localStorageService = new LocalStorageService(); 