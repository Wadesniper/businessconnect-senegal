import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  seller: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  images: string[];
  status: 'active' | 'inactive' | 'sold';
  condition: 'new' | 'like-new' | 'good' | 'fair' | 'poor';
  location: string;
  tags: string[];
  views: number;
  favorites: Schema.Types.ObjectId[];
  rating: number;
  numberOfRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: { 
    type: String, 
    required: true,
    index: true
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
  seller: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  },
  images: [{ 
    type: String,
    required: true
  }],
  status: { 
    type: String,
    enum: ['active', 'inactive', 'sold'],
    default: 'active'
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
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
  }
}, {
  timestamps: true
});

// Index pour la recherche
productSchema.index({ 
  title: 'text', 
  description: 'text',
  tags: 'text'
});

export const Product = mongoose.model<IProduct>('Product', productSchema); 