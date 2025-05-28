export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  previewImage: string;
  description: string;
  category: string;
  features: string[];
  profileImage: string;
  sampleData: {
    title: string;
    experience: string[];
    education: string[];
    skills: string[];
  };
  premium?: boolean;
  layout?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  address?: string;
  photo?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string[];
  achievements?: string[];
}

export interface Education {
  id: string;
  degree: string;
  field?: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies?: string[];
  url?: string;
}

export interface Interest {
  id: string;
  name: string;
  description?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Section {
  id: string;
  title: string;
  order: number;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary?: string;
  sections: Section[];
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  projects?: Project[];
  interests?: string[];
  certifications?: Certification[];
  template: Template | null;
}

export interface CVTemplateData extends CVData {
  template: Template;
}

export interface CustomizationOptions {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  spacing: 'compact' | 'comfortable' | 'spacious';
} 