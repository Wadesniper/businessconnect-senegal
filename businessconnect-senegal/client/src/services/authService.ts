import { User, LoginCredentials, RegisterData } from '../types/user';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

class AuthService {
  private async request(endpoint: string, options: any = {}) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios({
        url: `${API_URL}/api/auth/${endpoint}`,
        ...options,
        headers: {
          ...options.headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          await this.refreshToken();
          const token = localStorage.getItem('token');
          const retryResponse = await axios({
            url: `${API_URL}/api/auth/${endpoint}`,
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${token}`
            }
          });
          return retryResponse.data;
        } catch (refreshError) {
          this.logout();
          throw refreshError;
        }
      }
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const { user, token, refreshToken } = await this.request('login', {
        method: 'POST',
        data: credentials
      });

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
      }
      throw error;
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const { user, token, refreshToken } = await this.request('register', {
        method: 'POST',
        data
      });

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      return user;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
      }
      throw error;
    }
  }

  async refreshToken(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Refresh token manquant');
      }

      const { token, refreshToken: newRefreshToken } = await axios.post(
        `${API_URL}/api/auth/refresh`,
        { refreshToken }
      ).then(response => response.data);

      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', newRefreshToken);
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await this.request('logout', {
          method: 'POST'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await this.request('me');
      return user;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    return this.request(`users/${userId}`, {
      method: 'PATCH',
      data: updates
    });
  }
}

export const authService = new AuthService();
export type { RegisterData } from '../types/user'; 