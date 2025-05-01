import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  field: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  description: String,
  location: String
});

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  current: {
    type: Boolean,
    default: false
  },
  description: String,
  location: String,
  achievements: [String]
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['débutant', 'intermédiaire', 'avancé', 'expert'],
    required: true
  },
  category: {
    type: String,
    enum: ['technique', 'soft', 'langue'],
    required: true
  }
});

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'natif'],
    required: true
  }
});

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  issuer: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  expiryDate: Date,
  credentialId: String,
  credentialUrl: String
});

const cvSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  template: {
    type: String,
    required: true,
    enum: ['modern', 'classic', 'creative', 'professional']
  },
  personalInfo: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: String,
    address: String,
    city: String,
    country: String,
    title: String,
    summary: String,
    photo: String,
    linkedin: String,
    github: String,
    website: String
  },
  education: [educationSchema],
  experience: [experienceSchema],
  skills: [skillSchema],
  languages: [languageSchema],
  certifications: [certificationSchema],
  projects: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    technologies: [String],
    url: String,
    startDate: Date,
    endDate: Date
  }],
  customSections: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  lastGenerated: Date,
  pdfUrl: String,
  color: {
    type: String,
    default: '#2196f3'
  },
  font: {
    type: String,
    default: 'Roboto'
  }
}, {
  timestamps: true
});

// Indexes
cvSchema.index({ userId: 1 });
cvSchema.index({ 'personalInfo.firstName': 'text', 'personalInfo.lastName': 'text', 'personalInfo.title': 'text' });
cvSchema.index({ isPublic: 1 });

// Hooks
cvSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.lastGenerated = null;
    this.pdfUrl = null;
  }
  next();
});

export const CV = mongoose.model('CV', cvSchema);
export const Education = mongoose.model('Education', educationSchema);
export const Experience = mongoose.model('Experience', experienceSchema);
export const Skill = mongoose.model('Skill', skillSchema);
export const Language = mongoose.model('Language', languageSchema);
export const Certification = mongoose.model('Certification', certificationSchema); 