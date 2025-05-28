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
  title: "Chauffeur",
  company: "Fonds Monétaire International (FMI)",
  location: "Dakar, Sénégal",
  jobType: "Contrat à durée déterminée (1 an de période d'essai, renouvelable pour 3 ans)",
  sector: "Transport / Logistique / FMI / Institution internationale / Dakar",
  description: "Le FMI recrute un chauffeur pour sa mission résidente à Dakar. Sous l'autorité du Représentant Résident, le titulaire du poste assurera la conduite, la maintenance des véhicules de service, la livraison de documents et l'appui logistique aux déplacements du personnel.",
  missions: [
    "Assurer la conduite du personnel et des visiteurs officiels",
    "Veiller à la maintenance et à la propreté des véhicules de service",
    "Livrer des documents et assurer des courses administratives",
    "Appuyer la logistique lors des déplacements du personnel",
    "Respecter les règles de conduite et de sécurité en vigueur",
    "Faire preuve de discrétion et de professionnalisme en toutes circonstances"
  ],
  requirements: [
    "Diplôme d'études secondaires souhaité",
    "Permis de conduire valide",
    "3 à 5 ans d'expérience de conduite (y compris en milieu urbain et interurbain, idéalement avec des 4x4/SUV)",
    "Bonne connaissance des règles de conduite et de sécurité",
    "Capacité à faire preuve de discrétion et de professionnalisme",
    "Bonne présentation et aptitude à interagir avec des visiteurs de haut niveau",
    "Flexibilité (week-ends, jours fériés, horaires prolongés)",
    "Maîtrise du français ; connaissance de l'anglais est un atout"
  ],
  contactEmail: "RR-sen@imf.org",
  contactPhone: "",
  keywords: [
    "chauffeur",
    "FMI",
    "Dakar",
    "permis de conduire",
    "conduite défensive",
    "véhicule de service",
    "transport",
    "service logistique",
    "sécurité",
    "recrutement"
  ]
};

console.log('--- Début du script d\'insertion Chauffeur FMI ---');
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