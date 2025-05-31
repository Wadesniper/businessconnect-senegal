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

interface NewJob {
  title: string;
  company: string;
  location: string;
  jobType: string;
  sector: string;
  description: string;
  missions: string[];
  requirements: string[];
  contactEmail: string;
  contactPhone: string;
  keywords: string[];
}

const newJob: NewJob = {
  title: "Commercial(e)",
  company: "Webtel",
  location: "Sénégal",
  jobType: "Non précisé",
  sector: "Commercial / Vente / Technologie",
  description: "Webtel est à la recherche de talents dynamiques et passionnés pour rejoindre son équipe. Si vous êtes motivé(e) par la vente, avez un excellent sens du relationnel et souhaitez évoluer dans un environnement innovant, nous serions ravis de vous rencontrer.",
  missions: [
    "Prospecter de nouveaux clients",
    "Développer et fidéliser le portefeuille clients",
    "Négocier et conclure des contrats",
    "Assurer le suivi de la satisfaction client"
  ],
  requirements: [
    "Expérience en vente ou développement commercial",
    "Excellentes compétences en communication et en négociation",
    "Autonomie et proactivité",
    "Esprit d'équipe et forte capacité d'adaptation",
    "Connaissance du secteur technologique (un plus)"
  ],
  contactEmail: "recrutement@webtel.sn",
  contactPhone: "",
  keywords: [
    "commercial",
    "vente",
    "négociation",
    "prospection",
    "développement commercial",
    "fidélisation",
    "satisfaction client"
  ]
};

async function insertOneJob() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    const exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
    if (exists) {
      console.log('Offre déjà existante, aucune insertion.');
    } else {
      const result = await Job.create(newJob);
      console.log('Offre insérée :', result);
    }
    await mongoose.disconnect();
    console.log('Déconnexion MongoDB');
  } catch (err) {
    console.error('Erreur lors de l\'insertion :', err);
    if (err instanceof Error) {
      console.error('Stack:', err.stack);
    }
  }
}

insertOneJob(); 