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
  title: "Graphiste Designer",
  company: "",
  location: "",
  jobType: "Temps plein",
  sector: "Graphisme / Design / Communication visuelle / Marketing digital / Création graphique / Suite Adobe",
  description: "Nous recherchons un(e) graphiste designer pour renforcer notre équipe communication. Vous serez chargé(e) de la création de supports visuels et de contenus numériques en lien avec notre stratégie marketing.",
  missions: [
    "Rédiger, créer et gérer des outils de communication : articles de blog, infolettres, matériel promotionnel, fiches produits, annonces, etc.",
    "Mettre à jour régulièrement les contenus sur nos plateformes numériques.",
    "Déployer la stratégie marketing sur tous les canaux.",
    "Apporter des idées créatives et produire rapidement du contenu de qualité."
  ],
  requirements: [
    "Maîtrise obligatoire de la suite Adobe (Photoshop, Illustrator, InDesign, etc.)",
    "Excellentes capacités rédactionnelles en français",
    "Esprit d'analyse, rigueur, rapidité d'exécution",
    "Expérience dans la création d'annonces (atout majeur)"
  ],
  contactEmail: "gestionmsa221@gmail.com",
  contactPhone: "",
  keywords: [
    "graphiste",
    "designer",
    "communication visuelle",
    "marketing digital",
    "création graphique",
    "suite Adobe",
    "Photoshop",
    "Illustrator",
    "InDesign",
    "contenu numérique",
    "rédaction",
    "stratégie marketing"
  ]
};

console.log('--- Début du script d\'insertion Graphiste Designer ---');
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