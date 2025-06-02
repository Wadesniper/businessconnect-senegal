import { Schema, model, Document } from 'mongoose';

export interface IModule {
  title: string;
  description: string;
  duration: number;
  content: string;
}

export interface IFormation extends Document {
  title: string;
  slug: string;
  description: string;
  instructor: string;
  level: 'débutant' | 'intermédiaire' | 'avancé';
  duration: number;
  price: number;
  category: string;
  tags: string[];
  modules: IModule[];
  enrollments: number;
  cursaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  content: { type: String, required: true }
});

const formationSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  level: { type: String, enum: ['débutant', 'intermédiaire', 'avancé'], required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  modules: [moduleSchema],
  enrollments: { type: Number, default: 0 },
  cursaUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

formationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes pour améliorer les performances
formationSchema.index({ title: 'text', description: 'text' });
formationSchema.index({ status: 1, category: 1 });
formationSchema.index({ instructor: 1 });

export const Formation = model<IFormation>('Formation', formationSchema); 