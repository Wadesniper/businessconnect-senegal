export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  phoneNumber?: string;
  company?: any;
  settings?: UserSettings;
  lastLogin?: Date;
}

export type UserRole = 'admin' | 'etudiant' | 'entreprise' | 'formateur';

export interface UserSettings {
  notifications: boolean;
  newsletter: boolean;
  language: string;
  theme: 'light' | 'dark';
}

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  company?: {
    name: string;
    size: string;
    sector: string;
  };
} 