import axios, { AxiosResponse } from 'axios';
import { discussionsData } from '../data/forumData';
import { message } from 'antd';
import { authService } from './authService';

interface DiscussionData {
  title: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  tags?: string[];
}

interface ReplyData {
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
}

interface Discussion extends DiscussionData {
  id: string;
  createdAt: string;
  repliesCount: number;
  likesCount: number;
  replies: Reply[];
}

interface Reply extends ReplyData {
  id: string;
  createdAt: string;
  likesCount: number;
}

const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
if (!BASE_URL) {
  throw new Error('VITE_REACT_APP_API_URL n\'est pas définie dans les variables d\'environnement !');
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  async (config) => {
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
        // Ne pas rediriger si on est déjà sur la page de login ou d'inscription
        const currentPath = window.location.pathname;
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          authService.removeToken();
          message.error('Session expirée. Veuillez vous reconnecter.');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      // Gérer les erreurs de validation
      if (error.response.status === 422 || error.response.status === 400) {
        const validationErrors = error.response.data.errors;
        if (validationErrors) {
          Object.values(validationErrors).forEach((err: any) => {
            message.error(err);
          });
        } else if (error.response.data.message) {
          message.error(error.response.data.message);
        }
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
      // La requête a été faite mais pas de réponse reçue
      message.error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      message.error('Une erreur est survenue lors de la configuration de la requête.');
    }

    return Promise.reject(error);
  }
);

// Mock des appels API pour le forum en attendant l'implémentation backend
const forumApi = {
  getDiscussions: (): Promise<{ data: Discussion[] }> => {
    return Promise.resolve({ data: discussionsData });
  },

  getDiscussion: (id: string): Promise<{ data: Discussion }> => {
    const discussion = discussionsData.find(d => d.id === id);
    if (discussion) {
      return Promise.resolve({ data: discussion });
    }
    return Promise.reject(new Error('Discussion non trouvée'));
  },

  createDiscussion: (data: DiscussionData): Promise<{ data: Discussion }> => {
    const newDiscussion: Discussion = {
      id: String(discussionsData.length + 1),
      ...data,
      createdAt: new Date().toISOString(),
      repliesCount: 0,
      likesCount: 0,
      replies: []
    };
    discussionsData.unshift(newDiscussion);
    return Promise.resolve({ data: newDiscussion });
  },

  addReply: (discussionId: string, data: ReplyData): Promise<{ data: Reply }> => {
    const discussion = discussionsData.find(d => d.id === discussionId);
    if (discussion) {
      const newReply: Reply = {
        id: `${discussionId}-${discussion.replies.length + 1}`,
        ...data,
        createdAt: new Date().toISOString(),
        likesCount: 0
      };
      discussion.replies.push(newReply);
      discussion.repliesCount += 1;
      return Promise.resolve({ data: newReply });
    }
    return Promise.reject(new Error('Discussion non trouvée'));
  },

  likeDiscussion: (discussionId: string): Promise<{ data: { likesCount: number } }> => {
    const discussion = discussionsData.find(d => d.id === discussionId);
    if (discussion) {
      discussion.likesCount += 1;
      return Promise.resolve({ data: { likesCount: discussion.likesCount } });
    }
    return Promise.reject(new Error('Discussion non trouvée'));
  }
};

// Configuration des intercepteurs pour le mock du forum
api.interceptors.request.use(config => {
  if (config.url?.startsWith('/forum')) {
    const mockResponse = async (): Promise<AxiosResponse> => {
      const method = config.method?.toLowerCase();
      const url = config.url;

      if (!url) {
        throw new Error('URL non définie');
      }

      if (method === 'get') {
        if (url === '/forum/discussions') {
          const { data } = await forumApi.getDiscussions();
          return {
            data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          };
        } else if (url.match(/\/forum\/discussions\/\w+$/)) {
          const id = url.split('/').pop() || '';
          const { data } = await forumApi.getDiscussion(id);
          return {
            data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          };
        }
      } else if (method === 'post') {
        if (url === '/forum/discussions') {
          const { data } = await forumApi.createDiscussion(config.data);
          return {
            data,
            status: 201,
            statusText: 'Created',
            headers: {},
            config
          };
        } else if (url.match(/\/forum\/discussions\/\w+\/replies$/)) {
          const id = url.split('/')[3];
          const { data } = await forumApi.addReply(id, config.data);
          return {
            data,
            status: 201,
            statusText: 'Created',
            headers: {},
            config
          };
        } else if (url.match(/\/forum\/discussions\/\w+\/like$/)) {
          const id = url.split('/')[3];
          const { data } = await forumApi.likeDiscussion(id);
          return {
            data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          };
        }
      }

      throw new Error('Route non trouvée');
    };

    return {
      ...config,
      adapter: mockResponse
    };
  }
  return config;
}); 