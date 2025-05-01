import { Schema, model, Document } from 'mongoose';

export interface IModule {
  title: string;
  description?: string;
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
  thumbnail?: string;
  status: 'draft' | 'published' | 'archived';
  enrolledCount: number;
  rating: number;
  reviews: {
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true }
});

const formationSchema = new Schema<IFormation>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  level: { 
    type: String, 
    enum: ['débutant', 'intermédiaire', 'avancé'],
    required: true 
  },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  modules: [moduleSchema],
  thumbnail: { type: String },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'],
    default: 'draft' 
  },
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviews: [{
    userId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  featured: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Indexes pour améliorer les performances
formationSchema.index({ title: 'text', description: 'text' });
formationSchema.index({ status: 1, category: 1 });
formationSchema.index({ instructor: 1 });

export const Formation = model<IFormation>('Formation', formationSchema); 