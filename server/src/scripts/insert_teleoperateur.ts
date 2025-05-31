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
  title: "Téléopérateur/Téléopératrice",
  company: "",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Téléopération / Centre d'appel / Service client",
  description: "Nous recherchons des téléopérateurs/téléopératrices ayant une bonne maîtrise de la langue française, une aisance à parler au téléphone et l'art de convaincre. La maîtrise des outils bureautiques est également un atout. Si vous êtes motivé(e) et prêt(e) à commencer une nouvelle aventure avec nous, nous vous invitons à postuler.",
  missions: [
    "Assurer la réception et l'émission d'appels téléphoniques",
    "Convaincre et accompagner les clients au téléphone",
    "Utiliser les outils bureautiques pour le suivi des dossiers"
  ],
  requirements: [
    "Maîtrise de la langue française",
    "Aisance au téléphone",
    "Art de convaincre",
    "Maîtrise des outils bureautiques"
  ],
  contactEmail: "recrutementrholamsociety@gmail.com",
  contactPhone: "",
  keywords: [
    "téléopérateur",
    "téléopératrice",
    "langue française",
    "téléphone",
    "outils bureautiques",
    "convaincre"
  ]
};

console.log('--- Début du script d\'insertion Téléopérateur/Téléopératrice ---');
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