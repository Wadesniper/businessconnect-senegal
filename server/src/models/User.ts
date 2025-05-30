import { Schema, model } from 'mongoose';
import { z } from 'zod';

// Schéma de validation Zod
export const UserValidationSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional(),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['user', 'admin']).default('user'),
  phone: z.string()
    .refine(
      (value) => {
        // Nettoie le numéro en gardant uniquement les chiffres, les espaces et le +
        const cleaned = value.replace(/[^0-9\s+]/g, '');
        // Retire les espaces pour la validation
        const withoutSpaces = cleaned.replace(/\s/g, '');
        
        // Vérifie le format international
        if (withoutSpaces.startsWith('+')) {
          return withoutSpaces.length >= 10;
        }
        // Vérifie le format sénégalais
        return /^7\d{8}$/.test(withoutSpaces);
      },
      'Le numéro doit être au format international (+XXX...) ou sénégalais (7XXXXXXXX)'
    ),
  isVerified: z.boolean().default(false),
  resetPasswordToken: z.string().optional(),
  resetPasswordExpire: z.date().optional(),
  createdAt: z.date().default(() => new Date()),
});

// Interface TypeScript
export interface IUser {
  _id: string;
  name: string;
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
  name: { type: String, required: true, minlength: 2 },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(value: string) {
        // Nettoie le numéro en gardant uniquement les chiffres, les espaces et le +
        const cleaned = value.replace(/[^0-9\s+]/g, '');
        // Retire les espaces pour la validation
        const withoutSpaces = cleaned.replace(/\s/g, '');
        
        // Vérifie le format international
        if (withoutSpaces.startsWith('+')) {
          return withoutSpaces.length >= 10;
        }
        // Vérifie le format sénégalais
        return /^7\d{8}$/.test(withoutSpaces);
      },
      message: 'Le numéro doit être au format international (+XXX...) ou sénégalais (7XXXXXXXX)'
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