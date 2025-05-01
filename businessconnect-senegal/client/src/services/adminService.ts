import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

export interface JobData {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  type: string;
  salary?: string;
  contactEmail: string;
  contactPhone?: string;
}

export const adminService = {
  // Statistiques
  getStatistics: async (dateRange?: { start: Date; end: Date }, viewType: 'day' | 'week' | 'month' = 'week') => {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('start', dateRange.start.toISOString());
      params.append('end', dateRange.end.toISOString());
    }
    params.append('viewType', viewType);

    const response = await axios.get(
      `${API_URL}/admin/statistics?${params.toString()}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // Gestion des utilisateurs
  getUsers: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    const response = await axios.get(
      `${API_URL}/admin/users?${params.toString()}`,
      getAuthHeaders()
    );
    return response.data;
  },

  updateUserStatus: async (userId: string, status: 'active' | 'inactive') => {
    const response = await axios.patch(
      `${API_URL}/admin/users/${userId}/status`,
      { status },
      getAuthHeaders()
    );
    return response.data;
  },

  deleteUser: async (userId: string) => {
    await axios.delete(`${API_URL}/admin/users/${userId}`, getAuthHeaders());
  },

  // Gestion des abonnements
  getSubscriptions: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    const response = await axios.get(
      `${API_URL}/admin/subscriptions?${params.toString()}`,
      getAuthHeaders()
    );
    return response.data;
  },

  updateSubscription: async (subscriptionId: string, data: any) => {
    const response = await axios.patch(
      `${API_URL}/admin/subscriptions/${subscriptionId}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  // Gestion des offres d'emploi
  getJobs: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    const response = await axios.get(
      `${API_URL}/admin/jobs?${params.toString()}`,
      getAuthHeaders()
    );
    return response.data;
  },

  createJob: async (jobData: JobData) => {
    const response = await axios.post(
      `${API_URL}/admin/jobs`,
      jobData,
      getAuthHeaders()
    );
    return response.data;
  },

  updateJob: async (jobId: string, data: Partial<JobData>) => {
    const response = await axios.patch(
      `${API_URL}/admin/jobs/${jobId}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  deleteJob: async (jobId: string) => {
    await axios.delete(`${API_URL}/admin/jobs/${jobId}`, getAuthHeaders());
  },

  // Import d'offres d'emploi par lot
  importJobsFromFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(
      `${API_URL}/admin/jobs/import`,
      formData,
      {
        ...getAuthHeaders(),
        headers: {
          ...getAuthHeaders().headers,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Modération du forum
  getForumPosts: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    const response = await axios.get(
      `${API_URL}/admin/forum/posts?${params.toString()}`,
      getAuthHeaders()
    );
    return response.data;
  },

  moderatePost: async (postId: string, action: 'approve' | 'reject', reason?: string) => {
    const response = await axios.post(
      `${API_URL}/admin/forum/posts/${postId}/moderate`,
      { action, reason },
      getAuthHeaders()
    );
    return response.data;
  },

  // Modération du marketplace
  getMarketplaceItems: async (page = 1, limit = 10, filters = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit), ...filters });
    const response = await axios.get(
      `${API_URL}/admin/marketplace/items?${params.toString()}`,
      getAuthHeaders()
    );
    return response.data;
  },

  moderateItem: async (itemId: string, action: 'approve' | 'reject', reason?: string) => {
    const response = await axios.post(
      `${API_URL}/admin/marketplace/items/${itemId}/moderate`,
      { action, reason },
      getAuthHeaders()
    );
    return response.data;
  },
};

export default adminService; 