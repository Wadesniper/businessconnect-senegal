import { Document, Types } from 'mongoose';

export type FormationCategory = 'développement' | 'business' | 'marketing' | 'design' | 'langues' | 'soft-skills';
export enum FormationLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}
export enum FormationStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

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
  modules: IModule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFormationDocument extends IFormation, Document {
  id: string;
}

export interface IFormationCreationDTO extends Omit<IFormation, 'createdAt' | 'updatedAt' | 'rating' | 'enrolledStudents' | 'numberOfRatings'> {}

export interface IFormationUpdateDTO extends Partial<IFormationCreationDTO> {}

export interface IFormationStats {
  totalEnrollments: number;
  averageRating: number;
  completionRate: number;
  revenue: number;
  studentProgress: {
    userId: string;
    progress: number;
  }[];
}

export interface FormationFilters {
  category?: string;
  level?: string;
  status?: string;
  featured?: boolean;
  priceMin?: number;
  priceMax?: number;
  instructorId?: string;
}

export interface ModuleInput {
  title: string;
  description?: string;
  duration: number;
  content: string;
  order: number;
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