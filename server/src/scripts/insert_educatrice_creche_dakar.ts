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
  title: "Éducatrice / Maîtresse de Crèche",
  company: "",
  location: "Dakar, Sénégal",
  jobType: "CDI",
  sector: "Crèche / Petite enfance / Éducation / Garde d'enfants / Enseignement",
  description: "Nous recherchons 2 éducatrices / maîtresses pour une crèche. L'une des candidates recherchées doit justifier de plusieurs années d'expérience en petite enfance. Une augmentation de salaire est envisageable selon l'expérience du profil retenu.",
  missions: [],
  requirements: [
    "Expérience significative dans l'encadrement d'enfants en crèche",
    "Patience, pédagogie et sens des responsabilités",
    "Capacité à travailler en équipe"
  ],
  contactEmail: "",
  contactPhone: "+221 77 733 78 23",
  keywords: [
    "crèche",
    "éducatrice",
    "maîtresse d'école",
    "petite enfance",
    "Dakar",
    "garde d'enfants",
    "enseignement",
    "recrutement éducatif"
  ]
};

console.log('--- Début du script d\'insertion Éducatrice / Maîtresse de Crèche Dakar ---');
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