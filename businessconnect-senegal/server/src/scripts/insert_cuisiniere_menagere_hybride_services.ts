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
  title: "Cuisinière/Ménagère expérimentée",
  company: "Résidente expatriée (via Hybride Services)",
  location: "Centre-ville",
  jobType: "Temps plein",
  sector: "Cuisine / Ménage / Emploi domestique / Expatrié / Centre-ville / Hybride Services",
  description: "Une résidente expatriée installée en centre-ville recherche une cuisinière expérimentée capable d'assurer également des tâches ménagères quotidiennes.",
  missions: [
    "Préparer les repas au quotidien (cuisine locale et européenne)",
    "Assurer l'entretien général du logement (nettoyage, rangement, etc.)"
  ],
  requirements: [
    "Expérience confirmée en cuisine pour une clientèle expatriée",
    "Maîtrise des plats internationaux et locaux",
    "Sérieuse, discrète, professionnelle et digne de confiance",
    "Capacité à s'adapter aux goûts et préférences culinaires"
  ],
  contactEmail: "rh@hybrideservices.com",
  contactPhone: "+221 76 519 16 02",
  keywords: [
    "cuisinière",
    "ménage",
    "cuisine locale",
    "cuisine européenne",
    "emploi domestique",
    "centre-ville",
    "expatrié",
    "Hybride Services"
  ]
};

console.log('--- Début du script d\'insertion Cuisinière/Ménagère Hybride Services ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, contactPhone: newJob.contactPhone });
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