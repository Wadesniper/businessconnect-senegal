import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/user';
import { subscriptionData } from '../data/subscriptionData';
import { useLocation } from 'react-router-dom';

interface AuthContextType {
  user: (User & { subscription?: { status?: string; expireAt?: string; type?: 'etudiant' | 'annonceur' | 'employeur' } }) | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialisation immédiate depuis le localStorage
  const [user, setUser] = useState<User | null>(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false); // plus de blocage du rendu
  const location = useLocation();

  // Synchronisation avec localStorage à chaque navigation ou changement de storage
  useEffect(() => {
    const syncUser = () => {
      try {
        const u = localStorage.getItem('user');
        setUser(u ? JSON.parse(u) : null);
      } catch {
        setUser(null);
      }
    };
    syncUser();
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, [location]);

  // Mise à jour asynchrone depuis l'API (en arrière-plan)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          localStorage.setItem('user', JSON.stringify(currentUser));
          setUser(currentUser);
        }
      } catch (e) {
        // Ne rien faire, on garde le user du localStorage
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 