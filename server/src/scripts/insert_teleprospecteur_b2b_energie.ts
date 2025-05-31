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
  title: "Téléprospecteur B2B – Énergie (Électricité & Gaz)",
  company: "",
  location: "Télétravail",
  jobType: "Freelance",
  sector: "Téléprospection / Énergie / B2B",
  description: "Nous recrutons des téléprospecteurs expérimentés pour la prise de rendez-vous dans le cadre de changements de fournisseur d'électricité et de gaz en B2B. Le poste est à distance (télétravail). Il faut disposer d'un ordinateur, d'un casque et d'une connexion fibre. Rémunération versée tous les 15 jours, à discuter selon expérience et disponibilité.",
  missions: [
    "Prendre des rendez-vous pour des changements de fournisseur d'électricité et de gaz en B2B",
    "Contacter des entreprises à distance (télétravail)",
    "Assurer un suivi des rendez-vous pris"
  ],
  requirements: [
    "Minimum 1 an d'expérience en télévente ou prise de rendez-vous",
    "Excellent niveau de français et très bonne élocution",
    "Matériel requis : ordinateur, casque et connexion fibre"
  ],
  contactEmail: "mmsc.direction@gmail.com",
  contactPhone: "+221786086232",
  keywords: [
    "téléprospection",
    "télétravail",
    "freelance",
    "énergie",
    "électricité",
    "gaz",
    "B2B",
    "télévente",
    "rendez-vous",
    "expérience",
    "français",
    "prise de rendez-vous"
  ]
};

console.log('--- Début du script d\'insertion Téléprospecteur B2B Énergie ---');
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