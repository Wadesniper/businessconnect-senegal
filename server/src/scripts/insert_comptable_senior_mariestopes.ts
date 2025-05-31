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
  title: "Comptable Senior",
  company: "Marie Stopes Sénégal (ONG)",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Comptabilité / Finance / ONG",
  description: "Rejoignez notre équipe engagée et jouez un rôle clé dans l'amélioration de la santé reproductive au Sénégal ! Vous serez responsable de la gestion comptable et financière, en veillant à la conformité avec les normes en vigueur et en assurant un suivi rigoureux des opérations.",
  missions: [
    "Gestion comptable et financière de l'organisation",
    "Suivi rigoureux des opérations et conformité aux normes",
    "Élaboration des rapports financiers",
    "Participation à l'amélioration des procédures internes"
  ],
  requirements: [
    "BAC+4/5 en comptabilité (DSC/DESCAE est un atout)",
    "Minimum 10 ans d'expérience, idéalement dans le secteur des ONG",
    "Maîtrise des normes comptables",
    "Excellente maîtrise d'Excel et des outils financiers",
    "Leadership, rigueur analytique et esprit d'équipe"
  ],
  contactEmail: "recrutement@mariestopes.org.sn",
  contactPhone: "",
  keywords: [
    "comptabilité",
    "ONG",
    "finance",
    "Excel",
    "santé reproductive",
    "leadership",
    "rigueur",
    "Sénégal",
    "BAC+5",
    "DSC",
    "DESCAE",
    "comptable senior"
  ]
};

console.log('--- Début du script d\'insertion Comptable Senior Marie Stopes ---');
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