import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority";

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String },
  location: { type: String },
  jobType: { type: String },
  sector: { type: String },
  description: { type: String },
  missions: [{ type: String }],
  requirements: [{ type: String }],
  contactEmail: { type: String },
  contactPhone: { type: String },
  keywords: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

function isPhoneNumber(value: string): boolean {
  // Simple regex pour détecter un numéro de téléphone (commence par + ou 7/6/3, chiffres, espaces)
  return /^([+]?\d{1,3}[\s-]?)?(\d{2,3}[\s-]?){3,}$/.test(value.trim());
}

async function migrateContacts() {
  await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
  const jobs = await Job.find({});
  let modified = 0;
  for (const job of jobs) {
    if (job.contactEmail && isPhoneNumber(job.contactEmail)) {
      // Si contactPhone est déjà rempli, on ne touche pas
      if (!job.contactPhone) {
        job.contactPhone = job.contactEmail;
        job.contactEmail = '';
        await job.save();
        modified++;
        console.log(`Modifié : ${job.title} (${job._id})`);
      }
    }
  }
  await mongoose.disconnect();
  console.log(`Migration terminée. ${modified} documents modifiés.`);
}

migrateContacts().catch(console.error); 