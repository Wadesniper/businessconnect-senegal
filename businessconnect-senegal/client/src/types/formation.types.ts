export type FormationCategory = 'développement' | 'business' | 'marketing' | 'design' | 'langues' | 'soft-skills';

export enum FormationLevel {
  DEBUTANT = 'débutant',
  INTERMEDIAIRE = 'intermédiaire',
  AVANCE = 'avancé',
  EXPERT = 'expert'
}

export enum FormationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  category: FormationCategory[];
  level: FormationLevel;
  duration: number;
  price: number;
  currency: string;
  thumbnail?: string;
  instructor: string;
  rating?: number;
  enrolledStudents?: number;
  status: FormationStatus;
  objectives: string[];
  prerequisites?: string[];
  featured?: boolean;
  cursaUrl?: string;
}

export const DOMAIN_MAPPINGS = {
  'développement': 'https://cursa.app/formations/informatique',
  'business': 'https://cursa.app/formations/gestion-entreprise',
  'marketing': 'https://cursa.app/formations/marketing-digital',
  'design': 'https://cursa.app/formations/design-multimedia',
  'langues': 'https://cursa.app/formations/langues',
  'soft-skills': 'https://cursa.app/formations/soft-skills'
};

export interface CursaFormation {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: FormationCategory;
  level: FormationLevel;
  duration: string;
  price: number;
  cursaUrl: string;
  language: string;
}

export interface FormationFilters {
  category?: FormationCategory;
  level?: FormationLevel;
  status?: FormationStatus;
  featured?: boolean;
  priceMin?: number;
  priceMax?: number;
  durationMin?: number;
  durationMax?: number;
  searchTerm?: string;
  language?: string;
}

export interface FormationResponse {
  formations: Formation[];
  total: number;
  page: number;
  limit: number;
}

export interface ModuleInput {
  title: string;
  description?: string;
  duration: number;
  content: string;
  order: number;
  resources?: string[];
} 