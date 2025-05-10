import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'etudiant' | 'annonceur' | 'employeur';

export interface IUser extends Document {
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: UserRole;
  email?: string;
  avatar?: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  subscription?: {
    status: 'active' | 'expired' | 'cancelled';
    expireAt: Date | null;
  };
  company?: {
    name: string;
    secteur: string;
    taille: string;
    description?: string;
  };
  profile?: {
    titre?: string;
    competences?: string[];
    langues?: string[];
    experiences?: Array<{
      titre: string;
      entreprise: string;
      lieu: string;
      dateDebut: Date;
      dateFin?: Date;
      description?: string;
    }>;
    education?: Array<{
      diplome: string;
      etablissement: string;
      lieu: string;
      dateDebut: Date;
      dateFin?: Date;
      description?: string;
    }>;
  };
  settings?: {
    notifications: boolean;
    newsletter: boolean;
    language: string;
    theme: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  phoneNumber: {
    type: String,
    required: [true, 'Le numéro de téléphone est obligatoire'],
    unique: true,
    trim: true,
    match: [/^\+?[0-9]{8,15}$/, 'Format de numéro de téléphone invalide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'Le prénom est obligatoire'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    trim: true
  },
  fullName: String,
  role: {
    type: String,
    enum: {
      values: ['admin', 'etudiant', 'annonceur', 'employeur'],
      message: 'Rôle non valide'
    },
    required: [true, 'Le rôle est obligatoire']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Format email invalide']
  },
  avatar: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  subscription: {
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'expired'
    },
    expireAt: {
      type: Date,
      default: null
    }
  },
  company: {
    name: String,
    secteur: String,
    taille: String,
    description: String
  },
  profile: {
    titre: String,
    competences: [String],
    langues: [String],
    experiences: [{
      titre: String,
      entreprise: String,
      lieu: String,
      dateDebut: Date,
      dateFin: Date,
      description: String
    }],
    education: [{
      diplome: String,
      etablissement: String,
      lieu: String,
      dateDebut: Date,
      dateFin: Date,
      description: String
    }]
  },
  settings: {
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
      default: 'fr'
    },
    theme: {
      type: String,
      default: 'light'
    }
  }
}, {
  timestamps: true
});

// Middleware pour générer le nom complet avant la sauvegarde
userSchema.pre('save', function(next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

// Middleware pour hasher le mot de passe avant la sauvegarde
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

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erreur lors de la comparaison des mots de passe');
  }
};

export const User = mongoose.model<IUser>('User', userSchema); 