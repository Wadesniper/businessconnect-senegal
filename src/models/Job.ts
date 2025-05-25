import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String },
  sector: { type: String },
  description: { type: String },
  requirements: [{ type: String }],
  // Ajoute ici d'autres champs métier si besoin
}, { timestamps: true });

export default mongoose.model('Job', JobSchema); 