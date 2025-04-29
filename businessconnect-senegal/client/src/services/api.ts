import axios from 'axios';
import { discussionsData } from '../data/forumData';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
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
  (error) => {
    if (error.response) {
      // Gestion des erreurs HTTP
      switch (error.response.status) {
        case 401:
          // Redirection vers la page de connexion si non authentifié
          window.location.href = '/login';
          break;
        case 403:
          // Gestion des erreurs d'autorisation
          console.error('Accès non autorisé');
          break;
        case 404:
          // Gestion des ressources non trouvées
          console.error('Ressource non trouvée');
          break;
        case 500:
          // Gestion des erreurs serveur
          console.error('Erreur serveur');
          break;
        default:
          console.error('Erreur inattendue');
      }
    }
    return Promise.reject(error);
  }
);

// Mock des appels API pour le forum en attendant l'implémentation backend
const forumApi = {
  getDiscussions: () => {
    return Promise.resolve({ data: discussionsData });
  },

  getDiscussion: (id: string) => {
    const discussion = discussionsData.find(d => d.id === id);
    if (discussion) {
      return Promise.resolve({ data: discussion });
    }
    return Promise.reject(new Error('Discussion non trouvée'));
  },

  createDiscussion: (data: any) => {
    const newDiscussion = {
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

  addReply: (discussionId: string, data: any) => {
    const discussion = discussionsData.find(d => d.id === discussionId);
    if (discussion) {
      const newReply = {
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

  likeDiscussion: (discussionId: string) => {
    const discussion = discussionsData.find(d => d.id === discussionId);
    if (discussion) {
      discussion.likesCount += 1;
      return Promise.resolve({ data: { likesCount: discussion.likesCount } });
    }
    return Promise.reject(new Error('Discussion non trouvée'));
  }
};

// Remplacer les appels API réels par les mocks pour le développement
api.get('/forum/discussions', () => forumApi.getDiscussions());
api.get('/forum/discussions/:id', (config: any) => forumApi.getDiscussion(config.url?.split('/').pop() || ''));
api.post('/forum/discussions', (config: any) => forumApi.createDiscussion(config.data));
api.post('/forum/discussions/:id/replies', (config: any) => {
  const id = config.url?.split('/')[3];
  return forumApi.addReply(id, config.data);
});
api.post('/forum/discussions/:id/like', (config: any) => {
  const id = config.url?.split('/')[3];
  return forumApi.likeDiscussion(id);
});

export { api }; 