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
  title: "Électrotechnicien (H/F)",
  company: "RMO Sénégal",
  location: "Diogo, région de Thiès, Sénégal",
  jobType: "Temps plein",
  sector: "Énergies Renouvelables / Électricité / Maintenance",
  description: "Nous recrutons des électrotechniciens passionnés et motivés pour rejoindre notre équipe dans le secteur des Énergies Renouvelables. Vous serez responsable de l'installation, de la maintenance, de la réparation et de l'optimisation des systèmes électriques.",
  missions: [
    "Installation, maintenance et réparation des systèmes électriques dans le domaine des énergies renouvelables",
    "Optimisation des installations et suivi des performances",
    "Mise en œuvre d'actions correctives et amélioration continue"
  ],
  requirements: [
    "Formation : Bac +3 en électrotechnique ou domaine similaire",
    "Expérience : Minimum 2 ans d'expérience dans un poste similaire",
    "Passion pour les énergies renouvelables et les technologies électriques",
    "Autonomie, rigueur et implication dans des projets innovants"
  ],
  contactEmail: "recrutement@rmo.sn",
  contactPhone: "",
  keywords: [
    "électrotechnicien",
    "énergies renouvelables",
    "installation",
    "maintenance",
    "Thiès",
    "Sénégal"
  ]
};

console.log('--- Début du script d\'insertion Électrotechnicien RMO ---');
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