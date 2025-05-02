import { createContext, useContext, ReactNode } from 'react';

export const AuthContext = createContext({});
export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
);
export const useAuth = () => useContext(AuthContext); 