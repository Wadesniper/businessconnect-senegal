import { Document } from 'mongoose';

export interface IModule {
  title: string;
  description: string;
  duration: number;
  content: string;
  order: number;
}

export interface IFormation extends Document {
  title: string;
  description: string;
  instructor: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  duration: number;
  price: number;
  category: string;
  tags: string[];
  modules: IModule[];
  enrollments: number;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  slug: string;
  imageUrl?: string;
  videoUrl?: string;
  cursaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
} 