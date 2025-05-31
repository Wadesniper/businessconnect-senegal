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
  title: "Infographe / Graphiste",
  company: "",
  location: "Dakar",
  jobType: "Temps plein",
  sector: "Graphisme / Création visuelle / Design / Communication / Vidéo / Publicité",
  description: "Vous serez en charge de la création graphique, incluant la réalisation de visuels pour les réseaux sociaux, affiches, flyers, et autres supports de communication. Vous devrez aussi décliner l'identité visuelle de l'entreprise sur différents supports.",
  missions: [
    "Créer des visuels pour réseaux sociaux, affiches, flyers, etc.",
    "Décliner l'identité visuelle de l'entreprise sur différents supports",
    "Participer à la création de supports de communication variés",
    "Collaborer avec l'équipe communication et marketing"
  ],
  requirements: [
    "Excellente maîtrise des logiciels de création graphique : Photoshop, Illustrator, InDesign",
    "Compétences en montage vidéo : Premiere Pro, After Effects ou équivalent",
    "Création de visuels pour réseaux sociaux, affiches, flyers, etc.",
    "Capacité à décliner une identité visuelle sur différents supports",
    "Créativité, réactivité et sens du détail",
    "La connaissance de Canva est un plus"
  ],
  contactEmail: "agrecrutement2025@gmail.com",
  contactPhone: "",
  keywords: [
    "infographe",
    "graphiste",
    "Photoshop",
    "Illustrator",
    "InDesign",
    "montage vidéo",
    "Premiere Pro",
    "After Effects",
    "création visuelle",
    "design graphique",
    "Dakar"
  ]
};

console.log('--- Début du script d\'insertion Infographe / Graphiste Dakar ---');
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