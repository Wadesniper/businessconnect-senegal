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
  title: "Commercial(e) – Vente de services télécoms",
  company: "",
  location: "",
  jobType: "Temps plein",
  sector: "Télécoms / Vente / Prospection / Relation client / Communication / Services téléphoniques",
  description: "Nous recrutons des commerciaux dynamiques pour la vente de services télécoms. Vous serez en charge de démarcher les clients, présenter les offres, conclure les ventes et assurer un suivi client efficace.",
  missions: [
    "Démarcher les clients et présenter les offres",
    "Conclure les ventes de services télécoms",
    "Assurer un suivi client efficace"
  ],
  requirements: [
    "Être dynamique, motivé(e), autonome et orienté(e) résultats",
    "Être à l'aise à l'oral, en communication physique et téléphonique",
    "Une première expérience en vente est un atout, mais non obligatoire"
  ],
  contactEmail: "semiosadam@gmail.com",
  contactPhone: "",
  keywords: [
    "commercial",
    "télécoms",
    "vente",
    "prospection",
    "relation client",
    "communication",
    "services téléphoniques",
    "débutant accepté"
  ]
};

console.log('--- Début du script d\'insertion Commercial(e) – Vente de services télécoms ---');
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