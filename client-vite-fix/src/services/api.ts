import axios from 'axios';
import { message } from 'antd';
import { authService } from './authService';

// URL de base de l'API en production
const BASE_URL = 'https://businessconnect-senegal-api-production.up.railway.app';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': window.location.origin
  }
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs - CORRIGÉ pour éviter les messages automatiques
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Pour les erreurs d'authentification seulement
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/auth')) {
        authService.removeToken();
        message.error('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/auth';
      }
      return Promise.reject(error);
    }

    // Pour les erreurs de connexion réseau seulement
    if (!error.response && error.request) {
      console.error('Erreur de connexion:', error.request);
      // Ne pas afficher de message automatique - laisser les composants gérer
    }

    // Passer l'erreur sans afficher de message automatique
    return Promise.reject(error);
  }
);

export default api; 