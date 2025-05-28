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
  title: "Commerciaux (H/F)",
  company: "",
  location: "Sénégal",
  jobType: "CDI ou CDD (non précisé)",
  sector: "Commercial / Vente",
  description: "Nous recrutons des commerciaux (H/F) pour rejoindre une équipe dynamique. Le candidat idéal doit avoir de bonnes compétences en communication et être capable de conclure des ventes dans un environnement compétitif.",
  missions: [
    "Prospecter de nouveaux clients",
    "Négocier et conclure des ventes",
    "Maintenir une bonne relation avec les clients",
    "Travailler en collaboration avec l'équipe commerciale",
    "Participer aux formations et au développement professionnel"
  ],
  requirements: [
    "Expérience réussie en vente (un atout)",
    "Excellentes compétences en communication et en négociation",
    "Autonomie, proactivité et sens de l'organisation",
    "Esprit d'équipe et capacité d'adaptation"
  ],
  contactEmail: "recrutement740@gmail.com",
  contactPhone: "",
  keywords: [
    "commercial",
    "vente",
    "négociation",
    "communication",
    "prospection",
    "emploi commercial",
    "recrutement"
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