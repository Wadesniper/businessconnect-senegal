import mongoose, { Document } from 'mongoose';

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
}

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  jobType: { type: String },
  sector: { type: String },
  description: { type: String },
  requirements: [{ type: String }],
  contactEmail: { type: String },
  contactPhone: { type: String },
  createdBy: { type: String, required: true },
}, { timestamps: true });

// Ajout des index
JobSchema.index({ location: 1 });
JobSchema.index({ sector: 1 });
JobSchema.index({ jobType: 1 });

export default mongoose.model<IJob>('Job', JobSchema); 