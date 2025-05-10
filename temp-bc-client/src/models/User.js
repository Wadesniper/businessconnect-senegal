const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  fullName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'etudiant', 'annonceur', 'employeur'],
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
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
    experiences: [{
      poste: String,
      entreprise: String,
      debut: Date,
      fin: Date,
      description: String
    }],
    education: [{
      diplome: String,
      etablissement: String,
      annee: Number,
      domaine: String
    }],
    langues: [String]
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
      enum: ['fr', 'en'],
      default: 'fr'
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    }
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Erreur lors de la comparaison des mots de passe');
  }
};

userSchema.pre('save', function(next) {
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

module.exports = mongoose.model('User', userSchema); 