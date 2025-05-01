import axios, { AxiosResponse } from 'axios';
import { discussionsData, Discussion as ForumDiscussion, Reply as ForumReply } from '../data/forumData';

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

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Mock des appels API pour le forum en attendant l'implémentation backend
const forumApi = {
  getDiscussions: (): Promise<{ data: ForumDiscussion[] }> => {
    return Promise.resolve({ data: discussionsData });
  },

  getDiscussion: (id: string): Promise<{ data: ForumDiscussion }> => {
    const discussion = discussionsData.find(d => d.id === id);
    if (discussion) {
      return Promise.resolve({ data: discussion });
    }
    return Promise.reject(new Error('Discussion non trouvée'));
  },

  createDiscussion: (data: DiscussionData): Promise<{ data: ForumDiscussion }> => {
    const newDiscussion: ForumDiscussion = {
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

  addReply: (discussionId: string, data: ReplyData): Promise<{ data: ForumReply }> => {
    const discussion = discussionsData.find(d => d.id === discussionId);
    if (discussion) {
      const newReply: ForumReply = {
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