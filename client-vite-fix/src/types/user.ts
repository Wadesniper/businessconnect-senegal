export type UserRole = 'user' | 'admin' | 'employeur';

export interface User {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  subscription?: {
    status: string;
    expireAt?: string;
  };
}

export interface UserLoginData {
  phoneNumber: string;
  password: string;
}

export interface UserRegistrationData {
  name: string;
  email?: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  settings?: {
    notifications?: boolean;
    newsletter?: boolean;
    language?: 'fr' | 'en';
    theme?: 'light' | 'dark';
  };
  company?: {
    name?: string;
    secteur?: string;
    taille?: string;
    description?: string;
  };
  profile?: {
    titre?: string;
    competences?: string[];
    experiences?: {
      poste: string;
      entreprise: string;
      debut: string;
      fin?: string;
      description?: string;
    }[];
    education?: {
      diplome: string;
      etablissement: string;
      annee: number;
      domaine?: string;
    }[];
    langues?: string[];
  };
}

export interface Subscription {
  id: string;
  userId: string;
  type: 'etudiant' | 'annonceur' | 'employeur';
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
  phone: string;
  password: string;
}

export interface RegisterData {
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  email?: string;
  role?: UserRole;
  company?: {
    name: string;
    secteur: string;
  };
} 