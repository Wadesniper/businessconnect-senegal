export type UserRole = 'admin' | 'etudiant' | 'annonceur' | 'employeur';

export interface User {
  id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  isVerified: boolean;
  lastLogin?: string;
  company?: {
    name: string;
    secteur: string;
    taille: string;
    description?: string;
  };
  profile?: {
    titre?: string;
    competences?: string[];
    langues?: string[];
    experiences?: Array<{
      titre: string;
      entreprise: string;
      lieu: string;
      dateDebut: string;
      dateFin?: string;
      description?: string;
    }>;
    education?: Array<{
      diplome: string;
      etablissement: string;
      lieu: string;
      dateDebut: string;
      dateFin?: string;
      description?: string;
    }>;
  };
  settings?: {
    notifications: boolean;
    newsletter: boolean;
    language: string;
    theme: string;
  };
  subscription?: {
    status: 'active' | 'expired' | 'cancelled';
    expireAt: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface UserLoginData {
  phoneNumber: string;
  password: string;
}

export interface UserRegistrationData {
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  email?: string;
  company?: {
    name: string;
    secteur: string;
    taille: string;
    description?: string;
  };
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
  phoneNumber: string;
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