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
  title: "Commercial Immobilier",
  company: "",
  location: "Dakar, Sénégal",
  jobType: "CDI",
  sector: "Immobilier / Commercial / Vente / Prospection / Relation client",
  description: "Le commercial immobilier aura pour mission de développer le portefeuille clients, assurer l'accueil physique et téléphonique, prospecter et générer ses propres prospects. Il planifie ses visites, analyse les biens à commercialiser, met en œuvre la stratégie commerciale définie, négocie et conclut les contrats, tout en veillant au suivi administratif, au recouvrement, et à la satisfaction client.",
  missions: [
    "Développer le portefeuille clients",
    "Assurer l'accueil physique et téléphonique",
    "Prospecter et générer ses propres prospects",
    "Planifier les visites et analyser les biens à commercialiser",
    "Mettre en œuvre la stratégie commerciale définie",
    "Négocier et conclure les contrats",
    "Assurer le suivi administratif et le recouvrement",
    "Veiller à la satisfaction client"
  ],
  requirements: [
    "Expérience en vente immobilière ou en prospection commerciale",
    "Bonne connaissance des produits immobiliers (notices, prix, emplacements, commodités, etc.)",
    "Capacité à négocier, conclure des ventes, et assurer le recouvrement",
    "Maîtrise des outils informatiques et du système d'information (SF)",
    "Excellente communication, sens du service, rigueur et autonomie",
    "Capacité à faire du reporting régulier"
  ],
  contactEmail: "rivesdulac46@gmail.com",
  contactPhone: "",
  keywords: [
    "immobilier",
    "commercial",
    "prospection",
    "vente",
    "réservation",
    "recouvrement",
    "Dakar",
    "reporting",
    "relation client"
  ]
};

console.log('--- Début du script d\'insertion Commercial Immobilier Dakar ---');
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