import { api } from './api';

export const adminService = {
  getUsers: async (page = 1, limit = 10) => {
    const response = await api.get(`/users/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  // Stubs premium pour garantir la stabilité du site
  getSubscriptions: async () => {
    return { data: [], total: 0, message: 'Gestion des abonnements à venir.' };
  },
  getJobs: async () => {
    return { data: [], total: 0, message: 'Gestion des offres à venir.' };
  },
  getStatistics: async () => {
    return { data: {}, message: 'Statistiques à venir.' };
  },
  createJob: async (jobData: any) => {
    // Stub premium : à remplacer par la logique réelle dès que le backend est prêt
    return { success: false, message: 'Création d\'offre à venir.' };
  },
  // Ajoute d'autres stubs si besoin
  // D'autres méthodes (update, delete, etc.) seront ajoutées étape par étape
}; 