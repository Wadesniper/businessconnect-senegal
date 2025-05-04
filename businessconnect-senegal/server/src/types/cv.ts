import { Types, Document } from 'mongoose';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  title?: string;
  summary?: string;
  photo?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current?: boolean;
  description?: string;
}

export interface Experience {
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current?: boolean;
  description: string;
}

export type SkillLevel = 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
export type SkillCategory = 'technique' | 'soft' | 'langue';

export interface Skill {
  name: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  category?: string;
}

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Natif';
export interface Language {
  name: string;
  level: LanguageLevel;
}

export interface Certification {
  name: string;
  issuer: string;
  date: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Project {
  name: string;
  description?: string;
  technologies?: string[];
  url?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CustomSection {
  title: string;
  content: string;
}

export interface CVData {
  userId: Types.ObjectId | string;
  template: 'modern' | 'classic' | 'creative' | 'professional';
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  projects: Project[];
  customSections: CustomSection[];
  isPublic?: boolean;
  lastGenerated?: Date;
  pdfUrl?: string;
  color?: string;
  font?: string;
}

export enum CVTemplateType {
  PROFESSIONAL = 'professional',
  CREATIVE = 'creative',
  ACADEMIC = 'academic',
  MINIMAL = 'minimal',
  MODERN = 'modern'
}

export enum CVLanguage {
  FRENCH = 'fr',
  ENGLISH = 'en',
  WOLOF = 'wo'
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  location?: string;
}

export interface IExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  achievements?: string[];
  location?: string;
}

export interface ISkill {
  name: string;
  level: number; // 1-5
  category?: string;
}

export interface ILanguage {
  name: string;
  level: string; // A1-C2
}

export interface IPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
  title?: string;
  summary?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface ICV {
  userId: string;
  personalInfo: IPersonalInfo;
  education: IEducation[];
  experience: IExperience[];
  skills: ISkill[];
  languages: ILanguage[];
  certifications?: string[];
  interests?: string[];
  references?: string[];
  template: CVTemplateType;
  language: CVLanguage;
  isPublic: boolean;
  lastUpdated: Date;
  createdAt: Date;
}

export interface ICVDocument extends ICV, Document {
  id: string;
}

export interface ICVCreationDTO extends Omit<ICV, 'lastUpdated' | 'createdAt'> {}

export interface ICVUpdateDTO extends Partial<ICVCreationDTO> {}

export interface ICVTemplate {
  id: string;
  name: string;
  type: CVTemplateType;
  thumbnail: string;
  description?: string;
  isPremium: boolean;
  sections: string[];
  customStyles?: object;
}

export interface ICVExportOptions {
  format: 'pdf' | 'docx' | 'html';
  template: CVTemplateType;
  language: CVLanguage;
  includeSections?: string[];
  customStyles?: object;
}

export interface CV {
  userId: string;
  template: 'modern' | 'classic' | 'creative' | 'professional';
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    title?: string;
    summary?: string;
    photo?: string;
  };
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications?: {
    name: string;
    issuer: string;
    date: Date;
    expiryDate?: Date;
  }[];
  interests?: string[];
  references?: {
    name: string;
    position: string;
    company: string;
    contact: string;
  }[];
}

export type CVTemplate = CV['template'];
export type CVSection = keyof CV; 