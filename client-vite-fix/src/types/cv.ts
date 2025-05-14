export interface Template {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  description: string;
  premium: boolean;
  category: string;
  thumbnail: string;
  previewImage?: string;
  features?: string[];
  profileImage?: string;
  sampleData?: any;
}

export interface PersonalInfo {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  title: string;
  email: string;
  phone: string;
  address?: string;
  summary?: string;
  photo?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Experience {
  id?: string;
  title?: string;
  company: string;
  position?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  achievements?: string[];
  location?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  location?: string;
  achievements?: string[];
}

export interface Skill {
  id?: string;
  name: string;
  level: number | 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  category?: string;
}

export interface Language {
  id?: string;
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface Project {
  id?: string;
  name?: string;
  title?: string;
  description: string;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
  url?: string;
}

export interface Interest {
  id: string;
  name: string;
  description?: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Section {
  id: string;
  title: string;
  order: number;
}

export interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    address?: string;
    photo?: string;
    summary?: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    achievements?: string[];
  }>;
  education: Array<{
    degree: string;
    field?: string;
    institution: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    achievements?: string[];
  }>;
  skills: Array<{
    name: string;
    level?: number | 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
    category?: string;
  }>;
  languages?: Array<{
    name: string;
    level: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    description?: string;
  } | string>;
  projects?: Array<{
    name: string;
    description: string;
    url?: string;
    technologies?: string[];
    startDate?: string;
    endDate?: string;
  }>;
  interests?: string[];
}

export interface CustomizationOptions {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  spacing: 'comfortable' | 'compact' | 'wide';
}

export interface CVTemplateData extends CVData {
  template: Template;
}

export interface CV {
  id: string;
  userId: string;
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }[];
  createdAt: string;
  updatedAt: string;
  template: Template;
} 