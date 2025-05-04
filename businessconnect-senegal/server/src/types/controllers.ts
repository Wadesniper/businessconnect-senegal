import { Request } from 'express';
import { User } from './user';
import { Schema } from 'mongoose';
import { IUser } from './user';

// Types communs pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

// Types pour les requêtes authentifiées
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Types pour le contrôleur de forum
export interface CreateTopicRequest {
  title: string;
  content: string;
  category: string;
}

export interface CreatePostRequest {
  content: string;
  topicId: string;
}

export interface ReportRequest {
  reason: string;
}

// Types pour le contrôleur de CV
export interface CVRequest {
  template: string;
  sections: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      address: string;
      title: string;
    };
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: string;
      endDate: string;
      description?: string;
    }>;
    experience: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
      achievements?: string[];
    }>;
    skills: Array<{
      name: string;
      level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
      category?: string;
    }>;
    languages: Array<{
      name: string;
      level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Natif';
    }>;
    certifications?: Array<{
      name: string;
      issuer: string;
      date: string;
      expiration?: string;
    }>;
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
      url?: string;
    }>;
    customSections?: Array<{
      title: string;
      items: Array<{
        title: string;
        description: string;
        date?: string;
      }>;
    }>;
  };
}

// Types pour le contrôleur de formation
export interface ModuleRequest {
  title: string;
  duration: number;
  content: string;
  description?: string;
  order: number;
}

export interface FormationRequest {
  title: string;
  description: string;
  duration: string;
  price: number;
  category: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  instructor: Schema.Types.ObjectId;
  thumbnail?: string;
  startDate: Date;
  maxParticipants?: number;
  prerequisites?: string[];
  objectives?: string[];
  requirements?: string[];
  modules: ModuleRequest[];
  featured?: boolean;
}

// Types pour le contrôleur de marketplace
export interface ProductRequest {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  images: string[];
}

// Types pour le contrôleur de paiement
export interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

// Types pour le contrôleur d'abonnement
export interface SubscriptionRequest {
  type: 'etudiant' | 'annonceur' | 'recruteur';
  duration: number; // en mois
  paymentMethod: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: any;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
} 