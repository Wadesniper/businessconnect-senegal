export type UserRole = 'admin' | 'etudiant' | 'annonceur' | 'employeur';

export interface CompanyInformation {
  name?: string;
  secteur?: string;
  taille?: string;
  description?: string;
}

export interface ProfileInformation {
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
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    language: string;
  };
  company?: CompanyInformation;
  profile?: ProfileInformation;
}

export interface UserLoginData {
  phoneNumber: string;
  password: string;
}

export interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: UserRole;
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
  email: string;
  password: string;
}

export interface UserRegistrationResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
} 