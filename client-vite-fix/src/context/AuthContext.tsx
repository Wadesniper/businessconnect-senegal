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
    const token = authService.getToken();
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      // Le token est déjà dans les headers grâce à l'intercepteur de l'api
      const serverUser = await authService.getCurrentUser();
      if (serverUser) {
        setUser(serverUser);
        setIsAuthenticated(true);
        // Assurer la cohérence du localStorage
        authService.setUser(serverUser);
      } else {
        // Cas où le serveur ne renvoie pas d'erreur mais pas d'utilisateur
        throw new Error("Impossible de vérifier l'utilisateur");
      }
    } catch (e: any) {
      console.error('Auth Init Error - Token probablement invalide:', e.message);
      authService.removeToken();
      authService.removeUser();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour rafraîchir l'authentification
  const refreshAuth = async (): Promise<void> => {
    console.log("AuthProvider - Rafraîchissement manuel de l'authentification...");
    await initAuth();
  };

  // Initialisation au chargement
  useEffect(() => {
    const restoreSession = async () => {
      setLoading(true);
      const token = authService.getToken();
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
        } else {
          authService.clearAuthState();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (e) {
        authService.clearAuthState();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

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
      {loading ? (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
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