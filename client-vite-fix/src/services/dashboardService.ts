import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface DashboardStats {
  totalFormations: number;
  totalJobs: number;
  totalMarketplaceItems: number;
  totalForumPosts: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  getUserActivity: async () => {
    try {
      const response = await axios.get(`${API_URL}/dashboard/activity`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      throw error;
    }
  }
};

export default dashboardService; 