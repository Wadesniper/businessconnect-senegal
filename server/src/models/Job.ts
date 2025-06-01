import mongoose, { Document } from 'mongoose';
import { validatePhoneNumber } from '../utils/validation';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  jobType?: string;
  sector?: string;
  description?: string;
  requirements?: string[];
  contactEmail?: string;
  contactPhone?: string;
  createdBy: string;
  // Ajoute ici d'autres champs métier si besoin
}

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String },
  sector: { type: String },
  description: { type: String },
  requirements: [{ type: String }],
  contactEmail: { 
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Format d\'email invalide'
    }
  },
  contactPhone: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || validatePhoneNumber(v) !== null;
      },
      message: 'Format de numéro de téléphone invalide'
    }
  },
  createdBy: { type: String, required: true },
  // Ajoute ici d'autres champs métier si besoin
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema); 