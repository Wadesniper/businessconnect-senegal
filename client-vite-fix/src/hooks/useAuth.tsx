import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types/user';
import { subscriptionData } from '../data/subscriptionData';

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          setUser(null);
          setLoading(false);
          return;
        }
        const userSub = subscriptionData.find(sub => sub.userId === currentUser.id && sub.status === 'active');
        let cleanSubscription: { status?: string; expireAt?: string; type?: 'etudiant' | 'annonceur' | 'employeur' } = {};
        if (currentUser.subscription) {
          cleanSubscription = {
            ...currentUser.subscription,
            expireAt: currentUser.subscription.expireAt === null ? undefined : currentUser.subscription.expireAt,
            type: userSub?.type
          };
        }
        setUser({
          ...currentUser,
          subscription: Object.keys(cleanSubscription).length > 0 ? cleanSubscription : undefined
        } as User & { subscription?: { status?: string; expireAt?: string; type?: 'etudiant' | 'annonceur' | 'employeur' } });
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 