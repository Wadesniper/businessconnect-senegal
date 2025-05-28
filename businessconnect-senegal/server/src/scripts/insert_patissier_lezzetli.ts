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
  title: "Pâtissier",
  company: "Lezzetli",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Cuisine / Pâtisserie / Restauration",
  description: "Lezzetli recrute un(e) Pâtissier(ère) chargé(e) de réaliser des desserts pour des prestations B2B (individuels et traiteur), contrôler la qualité, le goût et la présentation des produits, et innover tout en respectant les contraintes de livraison et de conservation.",
  missions: [
    "Réaliser des desserts pour des prestations B2B (individuels et traiteur)",
    "Contrôler la qualité, le goût et la présentation des produits",
    "Innover tout en respectant les contraintes de livraison et de conservation"
  ],
  requirements: [
    "Formation en cuisine/pâtisserie (CAP, BEP ou équivalent)",
    "Expérience dans un environnement professionnel exigeant",
    "Sens de l'organisation, propreté et rigueur",
    "Esprit d'équipe, rapidité et adaptabilité",
    "Passion pour la pâtisserie et souci du détail"
  ],
  contactEmail: "elhadjidaouda.cisse@lezzetli.sn",
  contactPhone: "",
  keywords: [
    "pâtissier",
    "cuisine",
    "traiteur",
    "desserts",
    "CAP",
    "BEP",
    "rigueur",
    "innovation",
    "B2B",
    "gastronomie",
    "qualité",
    "restauration"
  ]
};

console.log('--- Début du script d\'insertion Pâtissier Lezzetli ---');
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