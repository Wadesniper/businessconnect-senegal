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
  title: "Vendeuse de Nems",
  company: "Non précisé",
  location: "Keur Massar et environs",
  jobType: "Temps plein ou temps partiel",
  sector: "Vente / Restauration / Keur Massar / Hygiène / Contact client / Temps partiel / Temps plein",
  description: "Dans le cadre de l'expansion de ses activités, l'entreprise recrute des vendeuses de nems pour assurer la vente directe sur des points définis. Les missions incluent l'accueil des clients avec convivialité, le conseil à la clientèle, ainsi que le respect des normes d'hygiène et de sécurité alimentaire.",
  missions: [
    "Assurer la vente directe de nems sur les points définis",
    "Accueillir les clients avec convivialité et professionnalisme",
    "Conseiller la clientèle sur les produits",
    "Respecter les normes d'hygiène et de sécurité alimentaire",
    "Veiller à la bonne présentation des produits et du point de vente"
  ],
  requirements: [
    "Femme âgée entre 18 et 35 ans",
    "Dynamique, ponctuelle et souriante",
    "Bon relationnel et sens du contact client",
    "Une expérience dans la vente est un atout",
    "Maîtrise du wolof et du français souhaitée"
  ],
  contactEmail: "malickseck.sbc@gmail.com",
  contactPhone: "77 357 47 49",
  keywords: [
    "vente",
    "restauration",
    "Keur Massar",
    "vendeuse",
    "nems",
    "hygiène",
    "contact client",
    "temps partiel",
    "temps plein"
  ]
};

console.log('--- Début du script d\'insertion Vendeuse de Nems ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, location: newJob.location, contactPhone: newJob.contactPhone });
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