import { useState, useEffect, useContext, createContext } from 'react';

interface Subscription {
  isActive: boolean;
  plan: 'basic' | 'premium' | 'enterprise';
  expiresAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  subscription?: Subscription;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Vérifier le token et charger les données utilisateur au démarrage
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Appel API pour vérifier le token et obtenir les données utilisateur
          // Pour l'exemple, on simule un utilisateur
          setUser({
            id: '1',
            email: 'user@example.com',
            name: 'John Doe',
            subscription: {
              isActive: true,
              plan: 'premium',
              expiresAt: '2024-12-31'
            }
          });
        }
      } catch (err) {
        setError('Erreur lors de la vérification de l\'authentification');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Appel API pour la connexion
      // Simulé pour l'exemple
      const response = {
        token: 'fake-token',
        user: {
          id: '1',
          email,
          name: 'John Doe',
          subscription: {
            isActive: true,
            plan: 'premium',
            expiresAt: '2024-12-31'
          }
        }
      };

      localStorage.setItem('token', response.token);
      setUser(response.user);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la connexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la déconnexion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // Appel API pour l'inscription
      // Simulé pour l'exemple
      const response = {
        token: 'fake-token',
        user: {
          id: '1',
          email,
          name,
          subscription: {
            isActive: false,
            plan: 'basic',
            expiresAt: ''
          }
        }
      };

      localStorage.setItem('token', response.token);
      setUser(response.user);
      setError(null);
    } catch (err) {
      setError('Erreur lors de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register
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