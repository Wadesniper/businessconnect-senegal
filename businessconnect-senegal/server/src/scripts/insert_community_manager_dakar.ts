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
  title: "Community Manager",
  company: "",
  location: "Dakar - Télétravail",
  jobType: "CDI / Temps plein",
  sector: "Community management / Communication digitale / Réseaux sociaux / WordPress / Vidéo / Stratégie digitale",
  description: "Dans le cadre de la campagne publicitaire de ses filiales, un groupe recherche des Community Managers dynamiques et créatifs, ayant une bonne maîtrise des outils digitaux, notamment WordPress. Vous serez chargé d'élaborer et d'exécuter la stratégie de communication digitale, de produire des contenus engageants, d'animer les réseaux sociaux, et de gérer les mises à jour sur le site web.",
  missions: [
    "Élaborer et exécuter la stratégie de communication digitale",
    "Créer des contenus visuels (maîtrise de Canva appréciée)",
    "Produire et monter des vidéos",
    "Élaborer un calendrier éditorial",
    "Animer et gérer les communautés sur LinkedIn, Facebook, Instagram, TikTok, etc.",
    "Gérer les mises à jour sur le site web via WordPress"
  ],
  requirements: [
    "Élaboration d'une stratégie de communication sur les réseaux sociaux",
    "Création de contenus visuels (maîtrise de Canva appréciée)",
    "Production et montage de vidéos",
    "Élaboration d'un calendrier éditorial",
    "Animation et gestion de communautés sur LinkedIn, Facebook, Instagram, TikTok, etc.",
    "Maîtrise de WordPress pour la gestion de contenus web"
  ],
  contactEmail: "agrecrutement2025@gmail.com",
  contactPhone: "",
  keywords: [
    "community manager",
    "réseaux sociaux",
    "Canva",
    "WordPress",
    "vidéo",
    "animation digitale",
    "communication",
    "stratégie digitale",
    "Dakar"
  ]
};

console.log('--- Début du script d\'insertion Community Manager Dakar ---');
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