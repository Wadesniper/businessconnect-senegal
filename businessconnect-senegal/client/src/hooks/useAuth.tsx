import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/user';
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
      const currentUser = await authService.getCurrentUser();
      const userSub = subscriptionData.find(sub => sub.userId === currentUser.id && sub.status === 'active');
      setUser({
        ...currentUser,
        subscription: {
          ...(currentUser.subscription || {}),
          type: userSub?.type
        } as any
      });
      setLoading(false);
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