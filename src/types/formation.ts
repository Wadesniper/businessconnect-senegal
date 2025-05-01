import { Document, Types } from 'mongoose';

export interface IModule {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  content: string;
  duration: number;
  order: number;
}

export interface IFormation extends Document {
  title: string;
  description: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  duration: number;
  price: number;
  instructor: Types.ObjectId;
  category: string;
  tags: string[];
  thumbnail: string;
  status: 'draft' | 'published' | 'archived';
  modules: IModule[];
  rating: number;
  reviews: Types.ObjectId[];
  enrollments: number;
  featured: boolean;
  cursaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
} 