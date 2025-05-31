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
  title: "Assistant(e) Chef de Projet IT",
  company: "Amd Corporate",
  location: "Dakar",
  jobType: "Intérim",
  sector: "Banque / Finance",
  description: "Le cabinet Amd Corporate recrute un(e) assistant(e) chef de projet IT pour un poste en intérim.",
  missions: [
    "Assister le chef de projet IT dans la gestion quotidienne des projets",
    "Participer à la coordination des équipes et au suivi des tâches",
    "Contribuer à la rédaction de documents de projet"
  ],
  requirements: [
    "Expérience ou compétences dans le domaine de la gestion de projet IT",
    "Intérêt pour le secteur bancaire et financier"
  ],
  contactEmail: "cv@amdcorporate.net",
  contactPhone: "",
  keywords: [
    "assistant chef de projet IT",
    "Dakar",
    "intérim",
    "banque",
    "finance",
    "gestion de projet IT"
  ]
};

console.log('--- Début du script d\'insertion Assistant Chef de Projet IT AMD ---');
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