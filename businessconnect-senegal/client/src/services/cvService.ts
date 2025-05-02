import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface CV {
  id: string;
  userId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    website?: string;
  };
  education: Array<{
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  languages: Array<{
    name: string;
    level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Natif';
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    url?: string;
    technologies?: string[];
  }>;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export interface CVTemplate {
  id: string;
  name: string;
  preview: string;
  description: string;
}

export const cvService = {
  getTemplates: async (): Promise<CVTemplate[]> => {
    try {
      const response = await axios.get(`${API_URL}/cv/templates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      throw error;
    }
  },

  getMyCVs: async (): Promise<CV[]> => {
    try {
      const response = await axios.get(`${API_URL}/cv`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des CVs:', error);
      throw error;
    }
  },

  getCV: async (id: string): Promise<CV> => {
    try {
      const response = await axios.get(`${API_URL}/cv/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du CV:', error);
      throw error;
    }
  },

  createCV: async (cvData: Omit<CV, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<CV> => {
    try {
      const response = await axios.post(`${API_URL}/cv`, cvData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création du CV:', error);
      throw error;
    }
  },

  updateCV: async (id: string, cvData: Partial<CV>): Promise<CV> => {
    try {
      const response = await axios.put(`${API_URL}/cv/${id}`, cvData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du CV:', error);
      throw error;
    }
  },

  deleteCV: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/cv/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du CV:', error);
      throw error;
    }
  },

  generatePDF: async (id: string): Promise<Blob> => {
    try {
      const response = await axios.get(`${API_URL}/cv/${id}/pdf`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw error;
    }
  },

  shareCV: async (id: string, email: string): Promise<void> => {
    try {
      await axios.post(`${API_URL}/cv/${id}/share`, { email }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
    } catch (error) {
      console.error('Erreur lors du partage du CV:', error);
      throw error;
    }
  },

  generateCV: async (cvData: Omit<CV, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<CV> => {
    try {
      const response = await axios.post(`${API_URL}/cv/generate`, cvData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération du CV:', error);
      throw error;
    }
  }
};

export default cvService; 