import { Document } from 'mongoose';

export interface IFormation extends Document {
  title: string;
  description: string;
  category: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  duration: number;
  price: number;
  instructor: string;
  cursaUrl?: string;
  thumbnail?: string;
  enrollments: number;
  rating?: number;
  reviews?: Array<{
    userId: string;
    rating: number;
    comment: string;
    date: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
} 