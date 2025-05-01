import React, { createContext, useContext, useState, useEffect } from 'react';
import { message } from 'antd';

interface User {
  id: string;
  email: string;
  name: string;
  hasActiveSubscription: boolean;
  subscriptionType?: 'basic' | 'premium';
  subscriptionEndDate?: Date;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkSubscription: () => Promise<boolean>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!token || !refreshToken) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        await refreshToken();
      } else {
        throw new Error('Session invalide');
      }
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) {
        throw new Error('Refresh token manquant');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: refresh })
      });

      if (response.ok) {
        const { token, refreshToken: newRefreshToken, user: userData } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        setUser(userData);
      } else {
        throw new Error('Impossible de rafraîchir la session');
      }
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const { token, refreshToken, user: userData } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        setUser(userData);
        message.success('Connexion réussie !');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Identifiants invalides');
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Erreur lors de la connexion');
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      message.success('Déconnexion réussie');
    }
  };

  const checkSubscription = async () => {
    if (!user) return false;

    try {
      const response = await fetch('/api/subscriptions/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const { hasActiveSubscription, subscriptionType, subscriptionEndDate } = await response.json();
        setUser(prev => prev ? { 
          ...prev, 
          hasActiveSubscription,
          subscriptionType,
          subscriptionEndDate: subscriptionEndDate ? new Date(subscriptionEndDate) : undefined
        } : null);
        return hasActiveSubscription;
      }
      
      if (response.status === 401) {
        await refreshToken();
        return checkSubscription();
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'abonnement:', error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkSubscription,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
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

export default useAuth; 