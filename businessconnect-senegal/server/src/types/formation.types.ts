import { Types } from 'mongoose';
import { BaseDocument, BaseEntity } from './common';

// Types de base
export interface IFormationBase {
  title: string;
  description: string;
  instructor: Types.ObjectId;
  price: number;
  duration: number;
  level: string;
  category: string;
  language: string;
  prerequisites: string[];
  objectives: string[];
  syllabus: {
    title: string;
    description: string;
    duration: number;
  }[];
  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  status: 'draft' | 'published' | 'archived';
  rating: number;
  views: number;
  enrolledStudents: number;
}

// Interface pour le modèle Mongoose
export interface IFormationDocument extends IFormationBase, BaseDocument {
  enrollments: Types.ObjectId[];
  reviews: {
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
  }[];
}

// Interface pour l'objet DTO
export interface IFormation extends IFormationBase, BaseEntity {
  enrollments: string[];
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    date: Date;
  }[];
}

// DTOs pour la création et la mise à jour
export type FormationCreationDTO = Omit<IFormationBase, 'rating' | 'views' | 'enrolledStudents'> & {
  instructor: string;
};

export type FormationUpdateDTO = Partial<FormationCreationDTO>;

// Types pour les filtres et les statistiques
export interface FormationFilters {
  category?: string;
  level?: string;
  language?: string;
  instructor?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
}

export interface IFormationStats {
  totalEnrollments: number;
  averageRating: number;
  completionRate: number;
  revenue: number;
  studentProgress: Array<{
    userId: string;
    progress: number;
    lastActivity: Date;
  }>;
}

// Type pour les modules
export interface ModuleInput {
  title: string;
  description: string;
  duration: number;
  content: string;
  order: number;
}

// Type pour la requête de formation
export interface FormationRequest {
  body: FormationCreationDTO | FormationUpdateDTO;
  params: {
    id?: string;
  };
  query: FormationFilters & {
    page?: string;
    limit?: string;
  };
}

export interface IFormationService {
  createFormation(data: FormationCreationDTO): Promise<IFormation>;
  getFormation(id: string): Promise<IFormation | null>;
  updateFormation(id: string, data: FormationUpdateDTO): Promise<IFormation | null>;
  deleteFormation(id: string): Promise<boolean>;
  listFormations(filters?: {
    category?: string;
    level?: string;
    language?: string;
    instructor?: string;
    status?: string;
  }): Promise<IFormation[]>;
  enrollStudent(formationId: string, studentId: string): Promise<IFormation>;
  unenrollStudent(formationId: string, studentId: string): Promise<IFormation>;
  addReview(formationId: string, review: {
    userId: string;
    rating: number;
    comment: string;
  }): Promise<IFormation>;
} 