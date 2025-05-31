import axios from 'axios';
import { message } from 'antd';
import { authService } from './authService';

// URL de base de l'API en production
const BASE_URL = 'https://businessconnect-senegal-api-production.up.railway.app';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    // Ne pas ajouter de token pour les routes d'authentification
    if (config.url?.includes('/auth/')) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Gérer les erreurs d'authentification
      if (error.response.status === 401) {
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/auth')) {
          authService.removeToken();
          message.error('Session expirée. Veuillez vous reconnecter.');
          window.location.href = '/auth';
        }
        return Promise.reject(error);
      }

      // Gérer les erreurs de validation
      if (error.response.status === 422 || error.response.status === 400) {
        const errorMessage = error.response.data.message || 'Erreur de validation';
        message.error(errorMessage);
        return Promise.reject(error);
      }

      // Gérer les erreurs serveur
      if (error.response.status >= 500) {
        message.error('Une erreur serveur est survenue. Veuillez réessayer plus tard.');
        return Promise.reject(error);
      }

      // Gérer les autres erreurs
      const errorMessage = error.response.data.message || 'Une erreur est survenue';
      message.error(errorMessage);
    } else if (error.request) {
      console.error('Erreur de connexion:', error.request);
      message.error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      console.error('Erreur de configuration:', error.message);
      message.error('Une erreur est survenue lors de la configuration de la requête.');
    }

    return Promise.reject(error);
  }
); 