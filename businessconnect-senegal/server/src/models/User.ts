import { Schema, model } from 'mongoose';

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
  firstName: { 
    type: String, 
    required: [true, 'Le prénom est requis'],
    trim: true,
    minlength: [2, 'Le prénom doit contenir au moins 2 caractères']
  },
  lastName: { 
    type: String, 
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères']
  },
  email: { 
    type: String, 
    unique: true, 
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez fournir un email valide']
  },
  password: { 
    type: String, 
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  role: { 
    type: String, 
    enum: {
      values: ['user', 'admin'],
      message: 'Le rôle doit être soit "user" soit "admin"'
    },
    default: 'user'
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    unique: true,
    trim: true
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index pour améliorer les performances des requêtes
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

export const User = model<IUser>('User', userSchema); 