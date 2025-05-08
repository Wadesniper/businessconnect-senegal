import { api } from './api';
import { message } from 'antd';
import { subscriptionData, UserSubscription } from '../data/subscriptionData';
import { User } from '../types/user';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const TOKEN_KEY = 'auth_token';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/auth/profile', data);
    return response.data;
  },

  async resetPassword(email: string): Promise<void> {
    await api.post('/auth/reset-password', { email });
  },

  async verifyResetToken(token: string): Promise<void> {
    await api.post('/auth/verify-reset-token', { token });
  },

  async setNewPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/set-new-password', { token, password });
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

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getCurrentUserSubscription(): UserSubscription | undefined {
    const user = this.getCurrentUser();
    if (!user) return undefined;
    return subscriptionData.find(sub => sub.userId === user.id);
  },

  setCurrentUserSubscriptionActive(active: boolean) {
    const user = this.getCurrentUser();
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