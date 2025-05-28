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
  title: "Aide-Cuisinier",
  company: "Lezzetli",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Cuisine / Restauration / Métier de bouche",
  description: "Lezzetli recrute un(e) Aide-Cuisinier(e) pour soutenir l'équipe en cuisine. Vous serez chargé(e) de réaliser les préparations de base, assister en cuisine lors des services, veiller à l'entretien des espaces de travail et du matériel, et appliquer strictement les procédures internes.",
  missions: [
    "Réaliser les préparations de base",
    "Assister en cuisine lors des services",
    "Veiller à l'entretien des espaces de travail et du matériel",
    "Appliquer strictement les procédures internes"
  ],
  requirements: [
    "Formation en cuisine ou pâtisserie (CAP, BEP ou équivalent)",
    "Expérience en environnement professionnel exigeant",
    "Rigueur, sens de l'organisation et propreté",
    "Rapidité, esprit d'équipe, adaptabilité",
    "Passion pour la cuisine et souci du détail"
  ],
  contactEmail: "elhadjidaouda.cisse@lezzetli.sn",
  contactPhone: "",
  keywords: [
    "aide-cuisinier",
    "cuisine",
    "restauration",
    "CAP",
    "BEP",
    "rigueur",
    "hygiène",
    "esprit d'équipe",
    "rapidité",
    "métier de bouche",
    "adaptabilité"
  ]
};

console.log('--- Début du script d\'insertion Aide-Cuisinier Lezzetli ---');
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