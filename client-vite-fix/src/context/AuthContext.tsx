import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { User, UserRegistrationData } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: UserRegistrationData) => Promise<{ token: string; user: User; } | void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction centralisée pour vérifier l'authentification
  const validateAuthState = (): boolean => {
    const token = authService.getToken();
    const localUser = authService.getUser();
    
    // Les deux doivent être présents pour être authentifié
    const isValid = !!(token && localUser);
    
    console.log('AuthProvider - Validation état auth:', {
      hasToken: !!token,
      hasUser: !!localUser,
      isValid
    });
    
    if (!isValid) {
      // Si état incohérent, nettoyer complètement
      authService.removeToken();
      authService.removeUser();
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
    
    return true;
  };

  // Fonction pour initialiser l'authentification
  const initAuth = async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Vérifier l'état local d'abord
      if (!validateAuthState()) {
        console.log('AuthProvider - État local invalide');
        setLoading(false);
        return;
      }

      // TOUJOURS vérifier la validité du token côté serveur
      // Même si on a des données locales
      try {
        console.log('AuthProvider - Validation token côté serveur...');
        const serverUser = await authService.getCurrentUser();
        
        // Token valide, synchroniser avec les données serveur
        if (serverUser) {
          authService.setUser(serverUser);
          setUser(serverUser);
          setIsAuthenticated(true);
          console.log('AuthProvider - Token valide, authentification confirmée');
        } else {
          throw new Error('Utilisateur non trouvé côté serveur');
        }
      } catch (serverError: any) {
        console.error('AuthProvider - Token invalide côté serveur:', serverError.message);
        
        // Token invalide côté serveur, nettoyer complètement
        authService.clearAuthState();
        setUser(null);
        setIsAuthenticated(false);
        setError('Session expirée. Veuillez vous reconnecter.');
      }
    } catch (error) {
      console.error('AuthProvider - Erreur initialisation:', error);
      setError('Erreur lors de la vérification de l\'authentification');
      
      // En cas d'erreur, nettoyer l'état
      authService.clearAuthState();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour rafraîchir l'authentification
  const refreshAuth = async (): Promise<void> => {
    await initAuth();
  };

  // Initialisation au chargement
  useEffect(() => {
    initAuth();
    
    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      console.log('AuthProvider - Changement localStorage détecté');
      initAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login({ phoneNumber: email, password });
      
      if (response && response.token && response.user) {
        // Sauvegarder de manière atomique
        authService.setToken(response.token);
        authService.setUser(response.user);
        
        // Mettre à jour l'état
        setUser(response.user);
        setIsAuthenticated(true);
        
        console.log('AuthProvider - Connexion réussie:', response.user.id);
      } else {
        throw new Error('Réponse de connexion invalide');
      }
    } catch (error: any) {
      console.error('AuthProvider - Erreur connexion:', error);
      setError(error.message || 'Erreur lors de la connexion');
      
      // Nettoyer en cas d'erreur
      authService.removeToken();
      authService.removeUser();
      setUser(null);
      setIsAuthenticated(false);
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      
      // Nettoyer localement d'abord
      authService.removeToken();
      authService.removeUser();
      setUser(null);
      setIsAuthenticated(false);
      
      // Puis côté serveur
      await authService.logout();
      
      console.log('AuthProvider - Déconnexion réussie');
    } catch (error: any) {
      console.error('AuthProvider - Erreur déconnexion:', error);
      setError('Erreur lors de la déconnexion');
      throw error;
    }
  };

  const register = async (data: UserRegistrationData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.register(data);
      
      if (response.success && response.data) {
        // Sauvegarder de manière atomique
        authService.setToken(response.data.token);
        authService.setUser(response.data.user);
        
        // Mettre à jour l'état
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        console.log('AuthProvider - Inscription réussie:', response.data.user.id);
        return response.data;
      } else {
        throw new Error(response.message || 'Erreur lors de l\'inscription');
      }
    } catch (error: any) {
      console.error('AuthProvider - Erreur inscription:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      
      // Nettoyer en cas d'erreur
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