import { api } from './api';

export interface JobOffer {
  id: string;
  title: string;
  company: string;
  location: string;
  sector: string;
  type: string;
  description: string;
  requirements: string[];
  contactEmail: string;
  contactPhone?: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  sector?: string;
  type?: string;
  search?: string;
}

export const jobService = {
  async getJobOffers(filters?: JobFilters): Promise<JobOffer[]> {
    try {
      const response = await api.get('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des offres:', error);
      throw error;
    }
  },

  async getJobOffer(id: string): Promise<JobOffer | null> {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'offre:', error);
      return null;
    }
  },

  async createJobOffer(jobData: Omit<JobOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobOffer | null> {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'offre:', error);
      throw error;
    }
  },

  async updateJobOffer(id: string, jobData: Partial<JobOffer>): Promise<JobOffer | null> {
    try {
      const response = await api.put(`/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'offre:', error);
      throw error;
    }
  },

  async deleteJobOffer(id: string): Promise<boolean> {
    try {
      await api.delete(`/jobs/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'offre:', error);
      return false;
    }
  },

  async applyToJob(jobId: string, cvFile: File): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('cv', cvFile);
      await api.post(`/jobs/${jobId}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return true;
    } catch (error) {
      console.error('Erreur lors de la candidature:', error);
      return false;
    }
  }
}; 