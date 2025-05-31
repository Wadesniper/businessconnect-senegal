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
  title: "Chauffeur intervenant",
  company: "",
  location: "Dakar – Zone Yoff / Ouakam (préférable)",
  jobType: "Temps plein / Intervention à la demande",
  sector: "Transport / Chauffeur",
  description: "Nous recherchons un chauffeur intervenant, serviable et disponible immédiatement, pour assurer des déplacements ponctuels ou réguliers. Le candidat devra maîtriser parfaitement la conduite de véhicules à boîte manuelle.",
  missions: [
    "Assurer des déplacements ponctuels ou réguliers",
    "Être disponible pour des interventions à la demande"
  ],
  requirements: [
    "Permis de conduire valide depuis au moins 4 ans",
    "Excellente maîtrise des voitures manuelles",
    "Sérieux, ponctuel, respectueux et discret",
    "Résidant de préférence à Yoff ou Ouakam"
  ],
  contactEmail: "",
  contactPhone: "+221 77 872 48 48",
  keywords: [
    "chauffeur",
    "permis B",
    "voiture manuelle",
    "Yoff",
    "Ouakam",
    "disponible",
    "conduite"
  ]
};

console.log('--- Début du script d\'insertion Chauffeur Intervenant ---');
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