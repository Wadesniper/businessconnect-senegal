import { api } from './api';
import { message } from 'antd';
import type { User, UserRole, UserRegistrationData, LoginCredentials, UserRegistrationResponse } from '../types/user';

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse['data']> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      if (response.data.success) {
        this.setToken(response.data.data.token);
        this.setUser(response.data.data.user);
        return response.data.data;
      }
      throw new Error(response.data.message || 'Erreur lors de la connexion');
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Erreur lors de la connexion');
      } else if (error.request) {
        throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
      } else {
        throw new Error('Une erreur est survenue lors de la configuration de la requête.');
      }
    }
  },

  async register(data: UserRegistrationData): Promise<UserRegistrationResponse> {
    try {
      console.log('Données d\'inscription:', data);
      const response = await api.post<UserRegistrationResponse>('/auth/register', data);
      console.log('Réponse du serveur:', response.data);
      
      if (response.data.success && response.data.data) {
        this.setToken(response.data.data.token);
        this.setUser(response.data.data.user);
        return response.data;
      }
      throw new Error(response.data.message || 'Erreur lors de l\'inscription');
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      if (error.response) {
        // Erreur avec réponse du serveur
        const errorMessage = error.response.data.message || 'Erreur lors de l\'inscription';
        throw new Error(errorMessage);
      } else if (error.request) {
        // Pas de réponse du serveur
        throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion et réessayer.');
      } else {
        // Erreur de configuration de la requête
        throw new Error('Une erreur est survenue lors de la configuration de la requête.');
      }
    }
  },

  logout() {
    this.removeToken();
    this.removeUser();
    window.location.href = '/login';
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      throw error;
    }
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.patch<User>('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      throw error;
    }
  },

  async resetPassword(phoneNumber: string): Promise<void> {
    await api.post('/auth/reset-password', { phoneNumber });
  },

  async verifyResetToken(token: string): Promise<void> {
    await api.post('/auth/verify-reset-token', { token });
  },

  async setNewPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/set-new-password', { token, password });
  },

  async verifyPhoneNumber(token: string): Promise<void> {
    await api.post('/auth/verify-phone', { token });
  },

  async updateSubscription(status: 'active' | 'cancelled'): Promise<User> {
    const response = await api.patch<User>('/auth/subscription', { status });
    return response.data;
  },

  async updateCompanyInfo(companyData: Partial<User['company']>): Promise<User> {
    const response = await api.patch<User>('/auth/company', companyData);
    return response.data;
  },

  async updateProfileInfo(profileData: Partial<User['profile']>): Promise<User> {
    const response = await api.patch<User>('/auth/profile-details', profileData);
    return response.data;
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  },

  getUserRole(): UserRole | null {
    const user = this.getUser();
    return user ? user.role : null;
  },

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  },

  isEtudiant(): boolean {
    return this.getUserRole() === 'etudiant';
  },

  isAnnonceur(): boolean {
    return this.getUserRole() === 'annonceur';
  },

  isEmployeur(): boolean {
    return this.getUserRole() === 'employeur';
  }
}; 