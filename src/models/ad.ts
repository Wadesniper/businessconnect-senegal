import mongoose, { Document, Schema } from 'mongoose';

export interface IAd extends Document {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  location: string;
  userId: mongoose.Types.ObjectId;
  status: 'active' | 'sold' | 'expired';
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const adSchema = new Schema<IAd>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'XOF'
  },
  category: {
    type: String,
    required: true
  },
  images: [{
    type: String
  }],
  location: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'expired'],
    default: 'active'
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des recherches
adSchema.index({ title: 'text', description: 'text' });
adSchema.index({ category: 1, status: 1 });
adSchema.index({ userId: 1 });
adSchema.index({ createdAt: -1 });

export const Ad = mongoose.model<IAd>('Ad', adSchema); 