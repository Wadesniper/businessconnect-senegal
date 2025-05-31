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
  title: "Assistant(e) Technico-Commercial(e)",
  company: "Grazeina",
  location: "",
  jobType: "CDI",
  sector: "Support commercial / Technique / Prospection / CRM / Relation client / Industrie / Informatique / Gestion",
  description: "Responsabilités et Activités Principales :\nSupport Commercial : Assister les commerciaux dans la gestion des offres et devis. Répondre aux demandes des clients en apportant des conseils techniques sur les produits/services. Assurer le suivi des commandes, de la facturation et des livraisons. Gérer et mettre à jour les bases de données clients et produits.\nDéveloppement et Prospection : Identifier les besoins des clients et proposer des solutions adaptées. Réaliser des actions de prospection pour identifier de nouvelles opportunités. Participer à la veille concurrentielle et technologique.\nSupport Technique : Apporter un appui technique aux clients en lien avec les équipes internes. Assurer la formation de base sur les produits/services pour les nouveaux clients. Rédiger et mettre à jour les fiches techniques et documentations commerciales.\nGestion Administrative : Suivre les dossiers clients et relancer les paiements si nécessaire. Préparer les reportings et statistiques de vente. Assister dans l'organisation des événements commerciaux et salons professionnels.\nÉvolution : Possibilité d'évolution vers des postes de Technico-Commercial, Responsable Commercial ou Responsable Produit.",
  missions: [
    "Assister les commerciaux dans la gestion des offres et devis",
    "Répondre aux demandes clients avec conseils techniques",
    "Assurer le suivi des commandes, facturation et livraisons",
    "Gérer et mettre à jour les bases de données clients et produits",
    "Identifier les besoins clients et proposer des solutions adaptées",
    "Prospecter pour de nouvelles opportunités",
    "Participer à la veille concurrentielle et technologique",
    "Appui technique aux clients avec les équipes internes",
    "Former les nouveaux clients sur les produits/services",
    "Rédiger et mettre à jour les fiches techniques et documentations commerciales",
    "Suivre les dossiers clients et relancer les paiements",
    "Préparer reportings et statistiques de vente",
    "Assister à l'organisation d'événements commerciaux et salons"
  ],
  requirements: [
    "Bonne maîtrise des outils bureautiques (Excel, Word, PowerPoint, CRM)",
    "Connaissances techniques dans le domaine d'activité de l'entreprise",
    "Capacité à rédiger des offres commerciales et techniques",
    "Aisance relationnelle et sens du service client",
    "Organisation, rigueur et gestion des priorités",
    "Autonomie et esprit d'initiative",
    "Capacité d'apprentissage et d'adaptation rapide",
    "Formation : Bac+2 à Bac+5 en Commerce, Technique (informatique, industrie, etc.) ou Gestion",
    "Expérience : Une première expérience en support commercial ou technique est un plus",
    "Langues : Maîtrise du français ; l'anglais est un atout"
  ],
  contactEmail: "rhtech@grazeina.com",
  contactPhone: "",
  keywords: [
    "support commercial",
    "technico-commercial",
    "prospection",
    "CRM",
    "relation client",
    "rédaction offres",
    "formation produits",
    "reporting",
    "évolution commerciale",
    "assistant technique"
  ]
};

console.log('--- Début du script d\'insertion Assistant(e) Technico-Commercial(e) Grazeina ---');
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