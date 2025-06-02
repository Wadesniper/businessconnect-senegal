import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { validatePhoneNumber } from '../utils/validation';
import { UserRole } from '../types/user';

// Interface TypeScript
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phoneNumber: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
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
  name: string;
  status: string;
}

// Schéma Mongoose avec validation
const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    minlength: [2, 'Le prénom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'etudiant', 'annonceur', 'employeur'],
    required: [true, 'Le rôle est requis']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    unique: true,
    validate: {
      validator: function(v: string) {
        return validatePhoneNumber(v) !== null;
      },
      message: 'Format de numéro de téléphone invalide'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'fr',
      enum: {
        values: ['fr', 'en'],
        message: 'Langue non supportée'
      }
    }
  },
  notifications: [{
    message: {
      type: String,
      required: true
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

// Index pour améliorer les performances des recherches
userSchema.index({ phoneNumber: 1 });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

// Middleware pour normaliser le numéro de téléphone avant la sauvegarde
userSchema.pre('save', function(next) {
  if (this.isModified('phoneNumber')) {
    const normalizedPhone = validatePhoneNumber(this.phoneNumber);
    if (normalizedPhone) {
      this.phoneNumber = normalizedPhone;
    }
  }
  next();
});

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erreur lors de la comparaison des mots de passe');
  }
};

export const User = mongoose.model<IUser>('User', userSchema); 