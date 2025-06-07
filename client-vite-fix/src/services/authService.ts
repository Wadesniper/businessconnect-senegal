import { api } from './api';
import { message } from 'antd';
import type { User, UserRole, UserRegistrationData, LoginCredentials, UserRegistrationResponse } from '../types/user';
// import { API_URL } from '../config'; // Commented out or removed
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  async login(credentials: LoginCredentials): Promise<User> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la connexion');
    }

    const data = await response.json();
    if (data.success && data.data && data.data.token && data.data.user) {
      this.setToken(data.data.token);
      this.setUser(data.data.user);
      return data.data.user;
    } else {
      throw new Error(data.message || 'Réponse de connexion invalide');
    }
  }

  async register(userData: UserRegistrationData): Promise<UserRegistrationResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }

    const data = await response.json();
    return data;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<User>('/api/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await api.patch<User>('/api/auth/profile', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        this.logout();
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      throw error;
    }
  }

  async resetPassword(phoneNumber: string): Promise<void> {
    await api.post('/api/auth/reset-password', { phoneNumber });
  }

  async verifyResetToken(token: string): Promise<void> {
    await api.post('/api/auth/verify-reset-token', { token });
  }

  async setNewPassword(token: string, password: string): Promise<void> {
    await api.post('/api/auth/set-new-password', { token, password });
  }

  async verifyPhoneNumber(token: string): Promise<void> {
    await api.post('/api/auth/verify-phone', { token });
  }

  async updateSubscription(status: 'active' | 'cancelled'): Promise<User> {
    const response = await api.patch<User>('/api/auth/subscription', { status });
    return response.data;
  }

  async updateCompanyInfo(companyData: Partial<User['company']>): Promise<User> {
    const response = await api.patch<User>('/api/auth/company', companyData);
    return response.data;
  }

  async updateProfileInfo(profileData: Partial<User['profile']>): Promise<User> {
    const response = await api.patch<User>('/api/auth/profile-details', profileData);
    return response.data;
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }

  clearAuthState(): void {
    this.removeToken();
    this.removeUser();
  }

  getUserRole(): UserRole | null {
    const user = this.getUser();
    return user ? user.role : null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  isEtudiant(): boolean {
    return this.getUserRole() === 'etudiant';
  }

  isAnnonceur(): boolean {
    return this.getUserRole() === 'annonceur';
  }

  isEmployeur(): boolean {
    return this.getUserRole() === 'employeur';
  }
}

// Export de l'instance singleton
export const authService = new AuthService(); 