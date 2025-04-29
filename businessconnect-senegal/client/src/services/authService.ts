import axios from 'axios';
import { User } from '../types/user';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const authService = {
  getToken: () => {
    return localStorage.getItem('token');
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },

  login: async (identifier: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      identifier,
      password,
    });
    const { token, user } = response.data;
    authService.setToken(token);
    authService.setCurrentUser(user);
    return user;
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
  }) => {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    const { token, user } = response.data;
    authService.setToken(token);
    authService.setCurrentUser(user);
    return user;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  verifyToken: async () => {
    try {
      const token = authService.getToken();
      if (!token) return false;

      const response = await axios.get(`${API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.valid;
    } catch {
      return false;
    }
  },
};

export default authService; 