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
  title: "Télévendeur Expérimenté – Vente Énergie",
  company: "",
  location: "Télétravail",
  jobType: "Temps plein",
  sector: "Télévente / Énergie / Vente à distance",
  description: "Nous recrutons des télévendeurs expérimentés spécialisés dans la vente de services liés à l'énergie. Nous serions ravis de vous accueillir dans notre équipe avec une rémunération attractive.",
  missions: [
    "Vendre des services liés à l'énergie à distance",
    "Convaincre et conclure des ventes par téléphone",
    "Travailler en autonomie et en équipe"
  ],
  requirements: [
    "Expérience préalable en télévente dans le secteur de l'énergie",
    "Excellente communication orale en français",
    "Capacité à convaincre et à conclure des ventes à distance",
    "Autonomie, motivation et esprit d'équipe"
  ],
  contactEmail: "badmasab@gmail.com",
  contactPhone: "",
  keywords: [
    "télévente",
    "énergie",
    "télétravail",
    "vente à distance",
    "freelance",
    "télévendeur",
    "électricité",
    "gaz",
    "expérience",
    "rémunération attractive"
  ]
};

console.log('--- Début du script d\'insertion Télévendeur Expérimenté Vente Énergie ---');
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