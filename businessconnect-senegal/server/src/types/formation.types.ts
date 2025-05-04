import { Document, Types } from 'mongoose';

export interface IFormation {
  id: string;
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
  enrollments: Types.ObjectId[];
  status: 'draft' | 'published' | 'archived';
  rating: number;
  reviews: {
    userId: Types.ObjectId;
    rating: number;
    comment: string;
    date: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFormationDocument extends Omit<IFormation, 'id'>, Document {
  id: string; // Redéfinition de id pour éviter le conflit avec Document
}

export type FormationCreationDTO = Omit<IFormation, 'id' | 'enrollments' | 'rating' | 'reviews' | 'createdAt' | 'updatedAt'>;

export type FormationUpdateDTO = Partial<FormationCreationDTO>;

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