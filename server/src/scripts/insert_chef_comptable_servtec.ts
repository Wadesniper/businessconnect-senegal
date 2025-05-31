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
  title: "Chef Comptable",
  company: "SERVTEC SENEGAL (pour le compte d'un client dans la production et exportation de légumes)",
  location: "Sénégal",
  jobType: "Non précisé",
  sector: "Comptabilité / Production / Exportation / Légumes / SERVTEC SENEGAL",
  description: "SERVTEC SENEGAL recrute un Chef Comptable pour un client spécialisé dans la production et l'exportation de légumes.",
  missions: [
    "Superviser la comptabilité générale et analytique",
    "Établir les états financiers et les rapports périodiques",
    "Assurer la conformité fiscale et sociale",
    "Gérer l'équipe comptable et coordonner les audits",
    "Optimiser les procédures et outils de gestion comptable"
  ],
  requirements: [
    "Expérience confirmée en comptabilité, idéalement dans la production ou l'exportation",
    "Maîtrise des normes comptables OHADA et des outils informatiques",
    "Rigueur, organisation et sens de la confidentialité"
  ],
  contactEmail: "recrutement@servtec-senegal.com",
  contactPhone: "",
  keywords: [
    "chef comptable",
    "comptabilité",
    "production",
    "exportation",
    "légumes",
    "Sénégal"
  ]
};

console.log('--- Début du script d\'insertion Chef Comptable SERVTEC SENEGAL ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, company: newJob.company, location: newJob.location });
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