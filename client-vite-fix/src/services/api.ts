import axios from 'axios';
import { message } from 'antd';
import { authService } from './authService';

// URL de base de l'API
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://web-production-d9921.up.railway.app';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Ne pas rediriger si on est sur une route de paiement
      const isPaymentRoute = error.config?.url?.includes('/subscriptions/');
      if (!isPaymentRoute) {
        // Token expiré ou invalide
        authService.clearAuthState();
        message.error('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 