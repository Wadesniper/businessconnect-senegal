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
  title: "Télévendeur / Télévendeuse",
  company: "Non précisé",
  location: "Non précisé",
  jobType: "Non précisé",
  sector: "Télévente / Prospection / Vente par téléphone / Relation client / Communication",
  description: "Dans le cadre de son développement, l'entreprise recrute des télévendeurs. Vous serez en charge de la prospection et de la vente par téléphone.",
  missions: [
    "Prospecter de nouveaux clients par téléphone",
    "Présenter et vendre les produits ou services de l'entreprise",
    "Assurer le suivi des prospects et clients",
    "Atteindre les objectifs de vente fixés",
    "Renseigner et conseiller les clients sur les offres"
  ],
  requirements: [
    "Très à l'aise au téléphone",
    "Bon niveau de langue",
    "Combativité, rigueur et dynamisme"
  ],
  contactEmail: "dgcompetence360@gmail.com",
  contactPhone: "",
  keywords: [
    "télévendeur",
    "vente par téléphone",
    "prospection",
    "relation client",
    "communication"
  ]
};

console.log('--- Début du script d\'insertion Télévendeur / Télévendeuse ---');
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