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
  title: "Commercial(e) Terrain Expérimenté(e)",
  company: "",
  location: "Diamniadio, Sénégal",
  jobType: "CDD (avec période d'essai de 3 à 6 mois renouvelable en CDI)",
  sector: "Matériaux de construction / Bois / Acier / Quincaillerie / BTP / Vente",
  description: "Nous recherchons deux commercial(e)s terrain expérimenté(e)s dans le secteur des matériaux de construction, en particulier dans le bois, les produits en acier et la quincaillerie. Les candidat(e)s retenu(e)s auront pour mission de développer et entretenir un portefeuille client dans les domaines du BTP, de la menuiserie ou de la distribution, de négocier les conditions commerciales, conclure les ventes et assurer un bon suivi client.",
  missions: [
    "Développer et entretenir un portefeuille client dans le secteur des matériaux de construction (bois, acier, quincaillerie)",
    "Négocier les conditions commerciales et conclure les ventes",
    "Assurer un suivi client de qualité",
    "Couvrir les domaines du BTP, de la menuiserie ou de la distribution"
  ],
  requirements: [
    "Expérience confirmée (3 à 5 ans minimum) dans la vente de matériaux de construction (bois, acier, quincaillerie)",
    "Portefeuille client établi à Dakar et ses environs",
    "Excellentes capacités de négociation et d'organisation",
    "Autonomie, dynamisme et ténacité",
    "Bonne connaissance du marché local"
  ],
  contactEmail: "cv@topwork.sn",
  contactPhone: "",
  keywords: [
    "commercial",
    "matériaux de construction",
    "bois",
    "acier",
    "quincaillerie",
    "BTP",
    "terrain",
    "vente",
    "Diamniadio",
    "CDD",
    "CDI"
  ]
};

console.log('--- Début du script d\'insertion Commercial(e) Terrain Expérimenté(e) Diamniadio ---');
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