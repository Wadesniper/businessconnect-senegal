import { createContext, useContext } from 'react';

export const AuthContext = createContext({});
export const AuthProvider = ({ children }: any) => (
  <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>
);
export const useAuth = () => useContext(AuthContext); 