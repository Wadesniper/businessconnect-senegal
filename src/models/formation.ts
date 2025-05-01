import mongoose from 'mongoose';

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
  cursaUrl: {
    type: String,
    required: true,
    unique: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour la recherche
formationSchema.index({ category: 1 });
formationSchema.index({ title: 'text', description: 'text' });

export const Formation = mongoose.model('Formation', formationSchema); 