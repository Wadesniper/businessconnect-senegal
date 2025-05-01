import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import { authService } from '../services/authService';
import { useRouter } from 'next/router';
import { message } from 'antd';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  checkSubscription: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await checkSubscription();
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const user = await authService.login({ email, password });
      setUser(user);
      await checkSubscription();
      message.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData: Partial<User>) => {
    try {
      setError(null);
      const user = await authService.register(userData);
      setUser(user);
      message.success('Inscription réussie !');
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de l\'inscription';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      message.success('Déconnexion réussie');
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      message.error('Erreur lors de la déconnexion');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await authService.request('reset-password', {
        method: 'POST',
        data: { email }
      });
      message.success('Instructions envoyées par email');
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la réinitialisation du mot de passe';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setError(null);
      if (!user?.id) throw new Error('Utilisateur non connecté');
      const updatedUser = await authService.updateUserProfile(user.id, userData);
      setUser(updatedUser);
      message.success('Profil mis à jour avec succès');
    } catch (error: any) {
      const errorMessage = error.message || 'Erreur lors de la mise à jour du profil';
      setError(errorMessage);
      message.error(errorMessage);
      throw error;
    }
  };

  const checkSubscription = async () => {
    if (!user) return false;
    try {
      const response = await authService.request('subscriptions/status');
      const { hasActiveSubscription, subscriptionType, subscriptionEndDate } = response;
      setUser(prev => prev ? {
        ...prev,
        hasActiveSubscription,
        subscriptionType,
        subscriptionEndDate: subscriptionEndDate ? new Date(subscriptionEndDate) : undefined
      } : null);
      return hasActiveSubscription;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
        updateProfile,
        checkSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}; 