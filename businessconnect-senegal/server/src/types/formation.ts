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

export interface IFormation extends Document {
  title: string;
  description: string;
  category: FormationCategory;
  level: FormationLevel;
  duration: number; // durée totale en minutes
  price: number;
  instructor: Types.ObjectId; // ID de l'utilisateur
  thumbnail: string;
  modules: IModule[];
  requirements: string[];
  objectives: string[];
  rating: number;
  numberOfRatings: number;
  enrolledStudents: Types.ObjectId[]; // IDs des utilisateurs
  status: FormationStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FormationFilters {
  category?: FormationCategory;
  level?: FormationLevel;
  status?: FormationStatus;
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