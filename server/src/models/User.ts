import { Schema, model, Document } from 'mongoose';
import { validatePhoneNumber } from '../utils/validation';

// Interface TypeScript
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  password: string;
  role: 'user' | 'admin' | 'recruiter';
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
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Format d\'email invalide'
    }
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'recruiter'],
      message: 'Rôle invalide'
    },
    default: 'user'
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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
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
  }]
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

export const User = model<IUser>('User', userSchema); 