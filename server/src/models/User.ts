import { Schema, model } from 'mongoose';

// Interface TypeScript
export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
  role: 'user' | 'admin';
  phoneNumber: string;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    language: string;
  };
  notifications?: Array<{
    _id: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }>;
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
  phoneNumber: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    unique: true,
    sparse: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        // Nettoie le numéro en gardant uniquement les chiffres et le +
        let cleaned = v.replace(/[^0-9+]/g, '');
        
        // Si le numéro commence par +, c'est déjà au format international
        if (cleaned.startsWith('+')) {
          // Vérifie que le numéro a une longueur valide (indicatif + 8 chiffres minimum)
          if (cleaned.length >= 10) return true;
          return false;
        }
        
        // Si le numéro commence par 77, 78, ou 76 (numéros sénégalais)
        if (/^(77|78|76|70)\d{7}$/.test(cleaned)) {
          return true;
        }
        
        return false;
      },
      message: 'Le numéro de téléphone doit commencer par 70, 76, 77 ou 78 pour les numéros sénégalais'
    }
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
  },
  preferences: {
    type: {
      notifications: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: true },
      language: { type: String, default: 'fr' }
    },
    default: {}
  },
  notifications: [{
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
});

// Index pour améliorer les performances des requêtes
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });

export const User = model<IUser>('User', userSchema); 