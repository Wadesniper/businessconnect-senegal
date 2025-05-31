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
  title: "Superviseur Commercial (H/F)",
  company: "Non précisée",
  location: "Thies, Sénégal",
  jobType: "Non précisé",
  sector: "Supervision / Commercial / Vente B2B / Matériaux / Gestion commerciale / Thies",
  description: "Encadrer, animer et motiver l'équipe commerciale (terrain et sédentaire). Organiser et répartir les objectifs de vente individuels et collectifs. Accompagner les commerciaux sur le terrain pour faciliter la conclusion des ventes. Évaluer les performances commerciales et mettre en place des actions correctives. Participer à la stratégie de prospection et fidélisation clients. Identifier les opportunités de croissance du chiffre d'affaires. Gérer la relation avec les grands comptes et clients stratégiques. Analyser les tendances du marché et surveiller la concurrence. Superviser le suivi des commandes, livraisons et service après-vente. Assurer le lien entre équipes commerciales, administratives et logistiques. Préparer les reportings réguliers (ventes, marges, performances). Participer à la sélection des produits à promouvoir et aux campagnes commerciales.",
  missions: [
    "Encadrer, animer et motiver l'équipe commerciale (terrain et sédentaire)",
    "Organiser et répartir les objectifs de vente individuels et collectifs",
    "Accompagner les commerciaux sur le terrain pour faciliter la conclusion des ventes",
    "Évaluer les performances commerciales et mettre en place des actions correctives",
    "Participer à la stratégie de prospection et fidélisation clients",
    "Identifier les opportunités de croissance du chiffre d'affaires",
    "Gérer la relation avec les grands comptes et clients stratégiques",
    "Analyser les tendances du marché et surveiller la concurrence",
    "Superviser le suivi des commandes, livraisons et service après-vente",
    "Assurer le lien entre équipes commerciales, administratives et logistiques",
    "Préparer les reportings réguliers (ventes, marges, performances)",
    "Participer à la sélection des produits à promouvoir et aux campagnes commerciales"
  ],
  requirements: [
    "Bac +3 à Bac +5 en commerce, gestion, marketing ou management",
    "Expérience significative en vente B2B, de préférence dans les matériaux ou secteur BTP",
    "Maîtrise des techniques de vente et négociation",
    "Bonne connaissance des outils de gestion commerciale (CRM, ERP, Excel)",
    "Compétences en encadrement et gestion d'équipe",
    "Français courant, anglais professionnel est un atout"
  ],
  contactEmail: "recrutementpcgsn@phoenixcga.com",
  contactPhone: "",
  keywords: [
    "superviseur commercial",
    "vente B2B",
    "encadrement équipe",
    "matériaux sanitaires",
    "Thies",
    "gestion commerciale"
  ]
};

console.log('--- Début du script d\'insertion Superviseur Commercial (H/F) ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, location: newJob.location, contactEmail: newJob.contactEmail });
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