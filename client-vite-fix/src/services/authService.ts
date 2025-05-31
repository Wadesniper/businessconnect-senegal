import { api } from './api';
import { message } from 'antd';
import type { UserSubscription } from '../data/subscriptionData';
import { subscriptionData } from '../data/subscriptionData';
import type { User, UserRole, UserRegistrationData, LoginCredentials } from '../types/user';

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
      }
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la connexion';
      message.error(errorMessage);
      throw error;
    }
  },

  async register(data: UserRegistrationData): Promise<{ success: boolean; message: string; data?: { token: string; user: User } }> {
    try {
      const response = await api.post<{ success: boolean; message: string; data?: { token: string; user: User } }>('/auth/register', data);
      if (response.data.success && response.data.data) {
        this.setToken(response.data.data.token);
        this.setUser(response.data.data.user);
      }
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'inscription';
      message.error(errorMessage);
      throw error;
    }
  },

  logout() {
    this.removeToken();
    this.removeUser();
    window.location.href = '/login';
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/api/auth/profile', data);
    return response.data;
  },

  async resetPassword(phoneNumber: string): Promise<void> {
    await api.post('/api/auth/reset-password', { phoneNumber });
  },

  async verifyResetToken(token: string): Promise<void> {
    await api.post('/api/auth/verify-reset-token', { token });
  },

  async setNewPassword(token: string, password: string): Promise<void> {
    await api.post('/api/auth/set-new-password', { token, password });
  },

  async verifyPhoneNumber(token: string): Promise<void> {
    await api.post('/api/auth/verify-phone', { token });
  },

  async updateSubscription(status: 'active' | 'cancelled'): Promise<User> {
    const response = await api.patch<User>('/api/auth/subscription', { status });
    return response.data;
  },

  async updateCompanyInfo(companyData: Partial<User['company']>): Promise<User> {
    const response = await api.patch<User>('/api/auth/company', companyData);
    return response.data;
  },

  async updateProfileInfo(profileData: Partial<User['profile']>): Promise<User> {
    const response = await api.patch<User>('/api/auth/profile-details', profileData);
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
  },

  getCurrentUserSubscription(): UserSubscription | undefined {
    const user = this.getUser();
    if (!user) return undefined;
    return subscriptionData.find(sub => sub.userId === user.id);
  },

  setCurrentUserSubscriptionActive(active: boolean) {
    const user = this.getUser();
    if (!user) return;
    const sub = subscriptionData.find(sub => sub.userId === user.id);
    if (sub) {
      sub.isActive = active;
      if (active) {
        sub.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
      } else {
        sub.expiresAt = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
      }
    }
  },

  renewCurrentUserSubscription() {
    this.setCurrentUserSubscriptionActive(true);
  },

  expireCurrentUserSubscription() {
    this.setCurrentUserSubscriptionActive(false);
  }
}; 