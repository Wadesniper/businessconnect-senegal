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
  title: "Commercial(e) Terrain",
  company: "",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Commercial / Prospection / Relation client / Vente / Fidélisation",
  description: "Nous recherchons un(e) Commercial(e) terrain ayant au minimum 2 ans d'expérience pour renforcer notre équipe. Le/la candidat(e) devra assurer la prospection, le suivi et la fidélisation de la clientèle tout en contribuant à la croissance de l'entreprise.",
  missions: [
    "Prospecter de nouveaux clients et développer le portefeuille commercial",
    "Informer les clients sur les produits et fournir un appui-conseil efficace",
    "Assurer un suivi régulier de la relation client",
    "Négocier et conclure de nouveaux contrats"
  ],
  requirements: [
    "Expérience d'au moins 2 ans dans une fonction commerciale",
    "Sens de la communication et de la négociation",
    "Esprit d'initiative, autonomie et capacité à travailler sur le terrain"
  ],
  contactEmail: "magvoyagesenegal@gmail.com",
  contactPhone: "",
  keywords: [
    "commercial terrain",
    "prospection",
    "relation client",
    "fidélisation",
    "vente",
    "contrat",
    "emploi commercial Sénégal"
  ]
};

console.log('--- Début du script d\'insertion Commercial(e) Terrain Sénégal ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
    if (exists) {
      console.log('Offre déjà existante, aucune insertion.');
    } else {
      console.log('Aucune offre existante trouvée, insertion en cours...');
      const result = await Job.create(newJob);
      console.log('Offre insérée :', result);
    }
    await mongoose.disconnect();
    console.log('Déconnexion MongoDB');
    console.log('--- Fin du script d\'insertion ---');
  } catch (err) {
    console.error('Erreur lors de l\'insertion :', err);
    if (err instanceof Error) {
      console.error('Stack:', err.stack);
    }
    console.log('--- Fin du script d\'insertion avec erreur ---');
  }
}

insertOneJob(); 