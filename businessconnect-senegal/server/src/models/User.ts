import { Schema, model } from 'mongoose';
import { z } from 'zod';

// Schéma de validation Zod
export const UserValidationSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['user', 'admin']).default('user'),
  phone: z.string()
    .refine(
      (value) => {
        // Nettoie le numéro en gardant uniquement les chiffres et le +
        const cleaned = value.replace(/[^0-9+]/g, '');
        
        // Vérifie le format international
        if (cleaned.startsWith('+')) {
          return cleaned.length >= 10;
        }
        
        // Vérifie le format sénégalais
        return /^7\d{8}$/.test(cleaned);
      },
      'Le numéro doit être au format international (+221 77 XXX XX XX) ou sénégalais (77 XXX XX XX)'
    ),
  isVerified: z.boolean().default(false),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpire: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
});

// Interface TypeScript
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
  role: 'user' | 'admin';
  phone: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
}

// Schéma Mongoose avec validation
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true, minlength: 2 },
  lastName: { type: String, required: true, minlength: 2 },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(value: string) {
        // Nettoie le numéro en gardant uniquement les chiffres et le +
        const cleaned = value.replace(/[^0-9+]/g, '');
        
        // Vérifie le format international
        if (cleaned.startsWith('+')) {
          return cleaned.length >= 10;
        }
        
        // Vérifie le format sénégalais
        return /^7\d{8}$/.test(cleaned);
      },
      message: 'Le numéro doit être au format international (+221 77 XXX XX XX) ou sénégalais (77 XXX XX XX)'
    }
  },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now }
});

// Index pour améliorer les performances des requêtes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

export const User = model<IUser>('User', userSchema); 