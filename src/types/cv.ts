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
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  photo?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  achievements?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface Skill {
  name: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  category?: string;
}

export interface Language {
  name: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

export interface CVData {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications?: string[];
  interests?: string[];
  references?: string[];
}

export interface CustomizationOptions {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  spacing: 'compact' | 'comfortable' | 'spacious';
} 