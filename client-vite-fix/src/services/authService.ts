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

  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    try {
      // Validation du numéro de téléphone avant l'envoi
      const phone = credentials.phoneNumber.replace(/[^0-9+]/g, '');
      if (!/^\+\d{1,4}\d{10,}$/.test(phone)) {
        throw new Error('Le numéro doit être au format international (+XXX XXXXXXXXX)');
      }

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...credentials,
          phoneNumber: phone // Envoyer le numéro normalisé
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      if (!data.success || !data.data || !data.data.token || !data.data.user) {
        throw new Error(data.message || 'Réponse de connexion invalide');
      }

      // Vérification de la cohérence des données
      if (!data.data.user.id || !data.data.user.role) {
        throw new Error('Données utilisateur incomplètes');
      }

      // Stockage des données d'authentification
      this.setToken(data.data.token);
      this.setUser(data.data.user);

      return { token: data.data.token, user: data.data.user };
    } catch (error: any) {
      // Nettoyage en cas d'erreur
      this.clearAuthState();
      throw error;
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
    return {
      ...data,
      token: data.data?.token,
      user: data.data?.user
    };
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ success: boolean; data: User }>('/api/auth/me');
      return response.data.data;
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

  async forgotPassword(phoneNumber: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'envoi du code SMS');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Erreur lors de l\'envoi du code SMS');
    }
  }

  async resetPassword(phoneNumber: string, code: string, password: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, code, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Erreur lors de la réinitialisation du mot de passe');
    }
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