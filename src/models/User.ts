import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  password: string;
  role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  subscription?: {
    status: 'active' | 'inactive' | 'expired';
    type: 'basic' | 'premium';
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
  };
  preferences?: {
    notifications: boolean;
    emailNotifications: boolean;
    language: string;
  };
  notifications?: Array<{
    id: string;
    type: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est requis']
  },
  email: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    unique: true
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
    default: 'etudiant'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  subscription: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'inactive'
    },
    type: {
      type: String,
      enum: ['basic', 'premium'],
      default: 'basic'
    },
    startDate: Date,
    endDate: Date,
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: 'fr'
    }
  },
  notifications: [{
    id: String,
    type: String,
    message: String,
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

// Middleware pour hasher le mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', userSchema); 