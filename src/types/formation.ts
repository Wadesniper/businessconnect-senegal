import { Document } from 'mongoose';

export interface IModule {
  title: string;
  duration: number;
  content: string;
  order: number;
  description?: string;
}

export interface IFormation extends Document {
  title: string;
  description: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  duration: number;
  price: number;
  category: string;
  instructor: string;
  thumbnail: string;
  status: 'draft' | 'published' | 'archived';
  modules: IModule[];
  featured: boolean;
  cursaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
} 