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
  title: "Chargé(e) de Production et Approvisionnement",
  company: "Non précisé",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Production / Approvisionnement / Logistique / Gestion des stocks / Coordination / Planification / Optimisation des coûts",
  description: "Le ou la Chargé(e) de Production et Approvisionnement est responsable de la planification, de l'organisation et du suivi des opérations de production. Il/elle assure l'approvisionnement en matières premières, veille à la coordination entre les équipes, au respect des délais, à la gestion des stocks, à la qualité des produits et à la maîtrise des coûts. Ce poste est essentiel pour garantir la fluidité des opérations et répondre efficacement aux exigences du marché.",
  missions: [
    "Planifier, organiser et suivre les opérations de production",
    "Assurer l'approvisionnement en matières premières et la gestion des stocks",
    "Coordonner les équipes de production et logistique",
    "Veiller au respect des délais et à la qualité des produits",
    "Optimiser les coûts et les flux logistiques",
    "Mettre en place des outils de suivi et d'amélioration continue"
  ],
  requirements: [
    "Expérience en gestion de la production et des approvisionnements",
    "Solides compétences en organisation, coordination et planification",
    "Connaissance des outils de gestion des stocks et des flux logistiques",
    "Capacité à travailler en équipe et sous pression",
    "Sens aigu de la qualité et de l'optimisation des coûts"
  ],
  contactEmail: "arrawtech@arrawtech.com",
  contactPhone: "",
  keywords: [
    "production",
    "approvisionnement",
    "gestion des stocks",
    "coordination",
    "planification",
    "optimisation des coûts",
    "logistique",
    "arrawtech"
  ]
};

console.log('--- Début du script d\'insertion Chargé(e) de Production et Approvisionnement ---');
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