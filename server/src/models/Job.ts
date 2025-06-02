import mongoose, { Schema, Document, Types } from 'mongoose';
import { validatePhoneNumber } from '../utils/validation';

export interface IJob extends Document {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: string;
  category: string;
  status: string;
  createdBy: Types.ObjectId;
  applications: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  company: {
    type: String,
    required: [true, 'Le nom de l\'entreprise est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  requirements: [{
    type: String,
    required: true
  }],
  location: {
    type: String,
    required: [true, 'La localisation est requise'],
    trim: true
  },
  salary: {
    min: {
      type: Number,
      required: [true, 'Le salaire minimum est requis']
    },
    max: {
      type: Number,
      required: [true, 'Le salaire maximum est requis']
    },
    currency: {
      type: String,
      default: 'XOF'
    }
  },
  type: {
    type: String,
    required: [true, 'Le type de contrat est requis'],
    enum: ['CDI', 'CDD', 'Stage', 'Freelance']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise']
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [{
    type: Types.ObjectId,
    ref: 'Application'
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances
jobSchema.index({ category: 1 });
jobSchema.index({ createdBy: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });

export const Job = mongoose.model<IJob>('Job', jobSchema); 