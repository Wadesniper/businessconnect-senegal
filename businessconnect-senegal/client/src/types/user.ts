export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'user' | 'admin' | 'recruiter';
  avatar?: string;
  subscription?: {
    type: 'free' | 'premium' | 'enterprise';
    status: 'active' | 'expired' | 'cancelled';
    expiresAt: string;
  };
  company?: {
    id: string;
    name: string;
    role: string;
  };
  settings?: {
    notifications: boolean;
    newsletter: boolean;
    language: 'fr' | 'en';
    theme: 'light' | 'dark';
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber: string;
}

export interface Subscription {
  id: string;
  userId: string;
  type: 'free' | 'premium' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  features: string[];
  price: number;
  currency: string;
  paymentMethod?: {
    type: string;
    last4?: string;
    expiryDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  notifications: boolean;
  newsletter: boolean;
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role?: 'user' | 'recruiter';
  company?: {
    name: string;
    role: string;
  };
} 