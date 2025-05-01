import { Schema, model } from 'mongoose';
import { z } from 'zod';

// Schéma de validation Zod
export const UserValidationSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['user', 'admin', 'instructor']).default('user'),
  isVerified: z.boolean().default(false),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpire: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
});

// Interface TypeScript
export interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin' | 'instructor';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma Mongoose
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin', 'instructor'], default: 'user' },
  avatar: { type: String },
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
userSchema.index({ email: 1 });

export const User = model<IUser>('User', userSchema); 