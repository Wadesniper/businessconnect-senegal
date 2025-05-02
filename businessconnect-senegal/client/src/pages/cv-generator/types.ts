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
  position: string;
  company: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Education {
  degree: string;
  school: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Skill {
  id?: string;
  name: string;
  level: number; // 1-5
}

export interface Language {
  id?: string;
  name: string;
  level: 'débutant' | 'intermédiaire' | 'avancé' | 'bilingue';
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications?: Certification[];
  projects: Project[];
  interests: string[];
}

export interface SampleData {
  title: string;
  experience: string[];
  education: string[];
  skills: string[];
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  previewImage: string;
  description: string;
  category: string;
  features: string[];
  profileImage: string;
  sampleData: SampleData;
}

export interface CustomizationOptions {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  spacing: 'compact' | 'comfortable' | 'spacious';
} 