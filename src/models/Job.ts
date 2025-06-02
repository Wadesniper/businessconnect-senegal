import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  title: string;
  company: string;
  location: string;
  type?: string;
  sector?: string;
  description?: string;
  requirements?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String },
  sector: { type: String },
  description: { type: String },
  requirements: [{ type: String }],
  // Ajoute ici d'autres champs métier si besoin
}, { timestamps: true });

export const Job = mongoose.model<IJob>('Job', JobSchema); 