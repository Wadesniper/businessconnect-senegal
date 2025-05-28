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
  title: "Stagiaire UX Designer",
  company: "",
  location: "Sénégal",
  jobType: "Stage",
  sector: "UX Design / Web / Mobile / Innovation",
  description: "En tant que Stagiaire UX Designer, vous participerez aux différentes phases de projets d'innovation, de design de services ou d'expériences utilisateurs, à travers des démarches centrées sur l'humain, en collaboration avec nos équipes pluridisciplinaires (UX, UI, PO, Développeurs…).",
  missions: [
    "Participer à la conception de parcours utilisateur (personas, journey maps, blueprints)",
    "Réaliser des storyboards, wireframes et prototypes (Figma, Sketch, InVision, Axure, Framer JS…)",
    "Collaborer avec des équipes pluridisciplinaires (UX, UI, PO, Développeurs)",
    "Contribuer à l'amélioration de l'expérience utilisateur sur web, mobile et print"
  ],
  requirements: [
    "Maîtrise des outils du Service/UX Design : conception de parcours utilisateur, storyboarding, wireframing et prototypage (Figma, Sketch, InVision, Axure, Framer JS…)",
    "Bonne connaissance des contraintes web, mobile et print",
    "Compréhension des principes d'ergonomie",
    "Connaissance appréciée de la suite Adobe Creative Cloud (InDesign, Photoshop, Illustrator) et Sketch"
  ],
  contactEmail: "recrutementdevsn@gmail.com",
  contactPhone: "",
  keywords: [
    "UX design",
    "stage",
    "Figma",
    "ergonomie",
    "wireframe",
    "prototype",
    "Adobe",
    "web",
    "mobile",
    "design thinking"
  ]
};

console.log('--- Début du script d\'insertion Stagiaire UX Designer ---');
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