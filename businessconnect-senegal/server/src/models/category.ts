import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  parent?: Schema.Types.ObjectId;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>({
  name: { 
    type: String, 
    required: true,
    unique: true
  },
  slug: { 
    type: String, 
    required: true,
    unique: true
  },
  description: { 
    type: String 
  },
  parent: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category'
  },
  icon: { 
    type: String 
  },
  order: { 
    type: Number,
    default: 0
  },
  isActive: { 
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour la recherche
categorySchema.index({ 
  name: 'text', 
  description: 'text' 
});

// Index pour le slug
categorySchema.index({ slug: 1 });

export const Category = mongoose.model<ICategory>('Category', categorySchema); 