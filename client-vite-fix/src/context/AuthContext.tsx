import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User, UserRegistrationData } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: UserRegistrationData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      authService.removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login({ phoneNumber: email, password });
      if (response && response.token && response.user) {
        authService.setToken(response.token);
        setUser(response.user);
      } else {
        throw new Error('Erreur lors de la connexion');
      }
    } catch (error) {
      setError('Erreur lors de la connexion');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      authService.removeToken();
      setUser(null);
    } catch (error) {
      setError('Erreur lors de la déconnexion');
      throw error;
    }
  };

  const register = async (data: UserRegistrationData) => {
    try {
      setError(null);
      const response = await authService.register(data);
      if (response.success && response.data) {
        authService.setToken(response.data.token);
        setUser(response.data.user);
      } else {
        throw new Error(response.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      setError('Erreur lors de l\'inscription');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      setError('Erreur lors de la mise à jour du profil');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 