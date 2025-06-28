import axios from 'axios';
import { message } from 'antd';
import { authService } from './authService';
import VersionService from './versionService';

// URL de base de l'API
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://web-production-38372.up.railway.app';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    console.log('[DEBUG API] Token utilisé pour Authorization:', token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification et de version
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestion des erreurs de version/compatibilité
    if (error.response?.status === 422 || error.response?.status === 400) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error;
      
      // Détecter les erreurs de schéma de données (compatibilité)
      if (errorMessage?.includes('validation') || errorMessage?.includes('schema')) {
        console.warn('Erreur de compatibilité détectée - possible mise à jour nécessaire');
        // Forcer un rechargement pour obtenir la nouvelle version
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        return Promise.reject(error);
      }
    }
    
    // Gestion des erreurs de réseau (possible mise à jour)
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      console.warn('Erreur réseau détectée - vérification de version...');
      // Vérifier si c'est un problème de version
      VersionService.getInstance().forceCheck();
    }
    
    if (error.response?.status === 401) {
      // Ne pas rediriger si on est sur une route de paiement
      const isPaymentRoute = error.config?.url?.includes('/subscriptions/');
      if (!isPaymentRoute) {
        // Token expiré ou invalide
        authService.clearAuthState();
        message.error('Session expirée. Veuillez vous reconnecter.');
        window.location.href = '/auth';
      }
    }
    
    // Gestion des erreurs 500 (serveur)
    if (error.response?.status >= 500) {
      message.error('Erreur serveur. Veuillez réessayer dans quelques instants.');
    }
    
    return Promise.reject(error);
  }
);

export default api; 