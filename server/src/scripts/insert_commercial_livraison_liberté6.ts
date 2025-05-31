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
  title: "Commercial(e) – Société de Livraison",
  company: "",
  location: "Dakar (Liberté 6 Extension)",
  jobType: "À définir selon le profil",
  sector: "Livraison / Commercial / Prospection / Développement commercial",
  description: "Une société de livraison basée à Dakar (Liberté 6 Extension) recherche une commerciale dynamique, indépendante et ayant le sens des affaires.",
  missions: [
    "Développer et fidéliser un portefeuille de clients",
    "Cibler et prospecter de nouveaux clients",
    "Promouvoir l'offre de services ou de produits",
    "Détecter des opportunités de croissance commerciale",
    "Coordonner la réception, la vérification et le suivi des colis"
  ],
  requirements: [
    "Aisance relationnelle et sens du contact client",
    "Esprit d'initiative et autonomie",
    "Sens de l'organisation et de la rigueur",
    "Expérience dans la vente ou la prospection est un atout"
  ],
  contactEmail: "",
  contactPhone: "+221 78 150 85 85",
  keywords: [
    "commerciale",
    "prospection",
    "livraison",
    "développement commercial",
    "suivi colis",
    "fidélisation",
    "Dakar",
    "Liberté 6"
  ]
};

console.log('--- Début du script d\'insertion Commercial(e) Société de Livraison Liberté 6 ---');
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