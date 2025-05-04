import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  duration: {
    type: Number, // en minutes
    required: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

const formationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['développement', 'business', 'marketing', 'design', 'langues', 'soft-skills']
  },
  level: {
    type: String,
    required: true,
    enum: ['débutant', 'intermédiaire', 'avancé']
  },
  duration: {
    type: Number, // durée totale en minutes
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  modules: [moduleSchema],
  requirements: [{
    type: String
  }],
  objectives: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numberOfRatings: {
    type: Number,
    default: 0
  },
  enrolledStudents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes pour la recherche
formationSchema.index({ title: 'text', description: 'text' });
formationSchema.index({ category: 1, level: 1 });
formationSchema.index({ status: 1 });

export const Formation = mongoose.model('Formation', formationSchema);
export const Module = mongoose.model('Module', moduleSchema); 