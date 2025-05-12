import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company?: string;
  location: string;
  jobType: 'CDI' | 'CDD' | 'Stage' | 'Freelance' | 'Alternance' | 'Temps partiel';
  sector: string;
  description: string;
  missions: string[];
  requirements: string[];
  contactEmail: string;
  contactPhone?: string;
  keywords?: string[];
  employerId?: mongoose.Types.ObjectId;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const JobSchema: Schema<IJob> = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['CDI', 'CDD', 'Stage', 'Freelance', 'Alternance', 'Temps partiel']
  },
  sector: {
    type: String,
    required: true,
    enum: [
      'Ressources Humaines',
      'Informatique',
      'Marketing',
      'Finance',
      'Commercial',
      'Communication',
      'Administration',
      'Logistique',
      'Production',
      'Juridique',
      'Autre'
    ]
  },
  description: {
    type: String,
    required: true
  },
  missions: [{
    type: String,
    required: true
  }],
  requirements: [{
    type: String,
    required: true
  }],
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  employerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

JobSchema.index({
  title: 'text',
  description: 'text',
  keywords: 'text',
  location: 'text'
});

const Job = mongoose.model<IJob>('Job', JobSchema);
export default Job; 