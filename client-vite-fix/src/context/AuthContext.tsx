import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User, UserRegistrationData } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: UserRegistrationData) => Promise<{ success: boolean; message: string; token?: string; user?: User; }>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const initAuth = useCallback(async () => {
    setLoading(true);
    const token = authService.getToken();
    console.log('[AuthProvider] Token trouvé dans le localStorage:', token);
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    try {
      const serverUser = await authService.getCurrentUser();
      if (serverUser) {
        setUser(serverUser);
        setIsAuthenticated(true);
        authService.setUser(serverUser);
        console.log('[AuthProvider] Utilisateur restauré:', serverUser);
      } else {
        throw new Error("Impossible de vérifier l'utilisateur");
      }
    } catch (e: any) {
      console.error('[AuthProvider] Erreur lors de la vérification du token:', e.message);
      authService.removeToken();
      authService.removeUser();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, []); // Exécuter seulement au montage du composant

  const login = async (phoneNumber: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const response = await authService.login({ phoneNumber, password });
      if (response && response.token && response.user) {
        authService.setToken(response.token);
        authService.setUser(response.user);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        throw new Error('Réponse de connexion invalide');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      authService.removeToken();
      authService.removeUser();
      setUser(null);
      setIsAuthenticated(false);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log('AuthProvider - Déconnexion...');
    try {
      // Notifier le serveur en premier, mais ne pas bloquer si ça échoue
      await authService.logout();
    } catch (error) {
      console.error("Erreur lors de l'appel de déconnexion au serveur, déconnexion locale quand même.", error);
    } finally {
      // Nettoyage local impératif
      authService.removeToken();
      authService.removeUser();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  const register = async (data: UserRegistrationData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.register(data);
      
      if (response.success && response.user && response.token) {
        authService.setToken(response.token);
        authService.setUser(response.user);
        setUser(response.user);
        setIsAuthenticated(true);
        return response;
      } else {
        throw new Error(response.message || 'Erreur lors de l\'inscription');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      authService.removeToken();
      authService.removeUser();
      setUser(null);
      setIsAuthenticated(false);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await authService.updateProfile(data);
      
      // Synchroniser les données
      authService.setUser(updatedUser);
      setUser(updatedUser);
      
      console.log('AuthProvider - Profil mis à jour');
    } catch (error: any) {
      console.error('AuthProvider - Erreur mise à jour profil:', error);
      setError('Erreur lors de la mise à jour du profil');
      throw error;
    }
  };

  // Fonction pour rafraîchir l'authentification (utilise la logique unifiée)
  const refreshAuth = async (): Promise<void> => {
    await initAuth();
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
    refreshAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    return {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      login: async () => {},
      logout: async () => {},
      register: async () => ({ success: false, message: "Provider non monté" }),
      updateProfile: async () => {},
      refreshAuth: async () => {}
    };
  }
  return context;
};

export default AuthContext; 