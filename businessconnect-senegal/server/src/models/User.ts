import { Schema, model } from 'mongoose';
import { z } from 'zod';

// Schéma de validation Zod
export const UserValidationSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['user', 'admin']).default('user'),
  phone: z.string().min(6, 'Le numéro de téléphone doit contenir au moins 6 chiffres'),
  isVerified: z.boolean().default(false),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpire: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
});

// Interface TypeScript
export interface IUser {
  _id: string;
  email?: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  phone: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified?: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpire?: Date | null;
}

// Schéma Mongoose
const userSchema = new Schema<IUser>({
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, required: true, unique: true },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpire: { type: Date, default: null },
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
userSchema.index({ email: 1 });

export const User = model<IUser>('User', userSchema); 