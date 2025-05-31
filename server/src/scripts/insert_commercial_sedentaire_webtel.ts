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
  title: "Commercial Sédentaire",
  company: "",
  location: "Dakar",
  jobType: "CDI",
  sector: "Commercial / Vente / B to B / Services / Propreté / Environnement / Multiservices",
  description: "Nous recherchons notre futur(e) Commercial(e) Sédentaire. Rattaché(e) à la Direction Commerciale, vous aurez pour mission de développer un portefeuille clients B to B dans le secteur qui vous sera confié. Vous assurerez un suivi relationnel et commercial de qualité pour explorer de nouveaux marchés, proposer des solutions personnalisées, réaliser les études techniques, élaborer les offres commerciales et piloter les appels d'offres jusqu'à la signature des contrats.",
  missions: [
    "Prospecter de nouveaux clients",
    "Étudier la concurrence et explorer de nouveaux marchés",
    "Traiter les demandes entrantes",
    "Élaborer et vendre des propositions commerciales",
    "Participer à la constitution des dossiers de renouvellement",
    "Réaliser des visites de site pour les besoins de chiffrage"
  ],
  requirements: [
    "Excellentes qualités relationnelles, sens du challenge et de la rigueur",
    "BTS/DUT Commercial, force de vente ou similaire",
    "Minimum 2 ans d'expérience en poste similaire ou dans un poste commercial B to B",
    "Connaissance des services de propreté, environnement ou multiservices",
    "À l'aise avec les outils bureautiques",
    "Langue exigée : Français (niveau maternel)"
  ],
  contactEmail: "info@webtel.sn",
  contactPhone: "",
  keywords: [
    "commercial",
    "vente",
    "B to B",
    "prospection",
    "appels d'offres",
    "CDI",
    "Dakar",
    "propreté",
    "services",
    "relation client",
    "études commerciales"
  ]
};

console.log('--- Début du script d\'insertion Commercial Sédentaire Webtel ---');
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