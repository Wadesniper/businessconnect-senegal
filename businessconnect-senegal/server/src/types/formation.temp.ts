import { Document, Types } from 'mongoose';

export type FormationCategory = 'développement' | 'business' | 'marketing' | 'design' | 'langues' | 'soft-skills';
export type FormationLevel = 'débutant' | 'intermédiaire' | 'avancé';
export type FormationStatus = 'draft' | 'published' | 'archived';

export interface IModule {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  duration: number; // en minutes
  content: string;
  order: number;
}

export interface IFormationContent {
  title: string;
  description: string;
  duration: number; // en minutes
  videoUrl?: string;
  resources?: string[];
}

export interface IFormation {
  title: string;
  description: string;
  category: FormationCategory[];
  level: FormationLevel;
  duration: number; // durée totale en minutes
  price: number;
  currency: string;
  instructor: string;
  thumbnail?: string;
  content: IFormationContent[];
  prerequisites?: string[];
  objectives: string[];
  rating?: number;
  enrolledStudents?: number;
  status: FormationStatus;
  modules: IModule[]; // Ajout de la propriété modules
  createdAt: Date;
  updatedAt: Date;
}

export interface IFormationDocument extends IFormation, Document {
  id: string;
}

export interface IFormationCreationDTO extends Omit<IFormation, 'createdAt' | 'updatedAt' | 'rating' | 'enrolledStudents'> {}

export interface IFormationUpdateDTO extends Partial<IFormationCreationDTO> {}

export interface IFormationStats {
  totalEnrollments: number;
  averageRating: number;
  completionRate: number;
  revenue: number;
  studentProgress: {
    userId: string;
    progress: number;
    lastAccessed: Date;
  }[];
}

export interface FormationInput {
  title: string;
  description: string;
  category: FormationCategory;
  level: FormationLevel;
  duration: number;
  price: number;
  thumbnail: string;
  modules?: ModuleInput[];
  requirements?: string[];
  objectives?: string[];
  status?: FormationStatus;
  featured?: boolean;
}

export interface ModuleInput {
  title: string;
  description?: string;
  duration: number;
  content: string;
  order: number;
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
  instructorId?: string;
} 