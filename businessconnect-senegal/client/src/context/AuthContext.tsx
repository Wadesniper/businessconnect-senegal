import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserFromToken, loginUser, logoutUser, registerUser } from '../services/authService';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromToken();
      setUser(user);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    const user = await loginUser(identifier, password);
    setUser(user);
    setLoading(false);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const register = async (data: any) => {
    setLoading(true);
    const user = await registerUser(data);
    setUser(user);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}; 