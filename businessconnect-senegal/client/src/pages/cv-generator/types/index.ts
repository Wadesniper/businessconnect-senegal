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

export interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    photo?: string;
    summary: string;
  };
  experience: {
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }[];
  education: {
    id: string;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  }[];
  skills: {
    id: string;
    name: string;
    level: number;
    category: string;
  }[];
  languages: {
    id: string;
    name: string;
    level: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    description: string;
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    url?: string;
    technologies: string[];
    startDate: string;
    endDate?: string;
  }[];
  interests: {
    id: string;
    name: string;
    description: string;
  }[];
}

export interface CustomizationOptions {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
  spacing: 'compact' | 'comfortable' | 'spacious';
}

export interface CVGeneratorProps {
  isSubscribed?: boolean;
} 