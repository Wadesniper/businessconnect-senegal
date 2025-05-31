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
  title: "Agent de Nettoyage",
  company: "",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Nettoyage / Hygiène / Propreté",
  description: "Vous êtes jeune, dynamique, sérieux(se) et motivé(e) ? Vous avez de l'expérience ou des compétences dans le nettoyage professionnel ou traditionnel ? Rejoignez notre équipe pour une opportunité de revenu selon votre disponibilité et votre implication.",
  missions: [
    "Assurer le nettoyage et l'entretien des locaux",
    "Respecter les consignes d'hygiène et de sécurité",
    "Travailler avec discipline, rigueur et méthode"
  ],
  requirements: [
    "Expérience ou compétences en nettoyage professionnel ou traditionnel",
    "Discipline, rigueur, respect et débrouillardise",
    "Méthode et sérieux dans le travail",
    "Disponible à temps plein ou à temps partiel"
  ],
  contactEmail: "agrecrutement2025@gmail.com",
  contactPhone: "",
  keywords: [
    "Nettoyage",
    "hygiène",
    "agent de propreté",
    "temps partiel",
    "temps plein",
    "recrutement",
    "emploi"
  ]
};

console.log('--- Début du script d\'insertion Agent de Nettoyage ---');
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