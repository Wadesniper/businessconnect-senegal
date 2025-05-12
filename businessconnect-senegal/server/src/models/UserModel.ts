import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  role: 'admin' | 'etudiant' | 'annonceur' | 'employeur';
  email?: string;
  avatar?: string;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  subscription?: {
    status: 'active' | 'expired' | 'cancelled';
    expireAt?: Date | null;
  };
  company?: {
    name?: string;
    secteur?: string;
    taille?: string;
    description?: string;
  };
  profile?: {
    titre?: string;
    competences?: string[];
    langues?: string[];
    experiences?: Array<{
      titre?: string;
      entreprise?: string;
      lieu?: string;
      dateDebut?: Date;
      dateFin?: Date;
      description?: string;
    }>;
    education?: Array<{
      diplome?: string;
      etablissement?: string;
      lieu?: string;
      dateDebut?: Date;
      dateFin?: Date;
      description?: string;
    }>;
  };
  settings?: {
    notifications?: boolean;
    newsletter?: boolean;
    language?: string;
    theme?: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Le numéro de téléphone est obligatoire'],
    unique: true,
    trim: true,
    match: [/^7[0-9]{8}$/, 'Le numéro de téléphone doit commencer par 7 et avoir 9 chiffres']
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
    enum: ['admin', 'etudiant', 'annonceur', 'employeur'],
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

UserSchema.pre<IUser>('save', function (next) {
  if (this.isModified('firstName') || this.isModified('lastName')) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as any);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erreur lors de la comparaison des mots de passe');
  }
};

export const User = mongoose.model<IUser>('User', UserSchema); 