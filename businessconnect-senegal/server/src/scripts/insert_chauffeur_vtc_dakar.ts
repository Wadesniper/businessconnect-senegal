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
  title: "Chauffeur VTC",
  company: "",
  location: "Dakar (Liberté 1 à 6, Sacré-Cœur 1 à 3, Dieuppeul, Derklé, Mermoz, Ouakam, Ngor, Yoff, Fann, Point E, Grand Dakar, Biscuiterie)",
  jobType: "Temps plein – Travail par shift (jour ou nuit)",
  sector: "VTC / Transport / Mobilité / Chauffeur privé / Dakar",
  description: "Nous recherchons un chauffeur VTC dynamique et sérieux pour rejoindre notre équipe. Si vous maîtrisez Yango, Heetch ou toute autre application VTC, ce poste est fait pour vous. Le travail s'effectue par shift de 12h (10h–22h ou 22h–10h).",
  missions: [],
  requirements: [
    "Être présentable et professionnel",
    "Avoir une excellente conduite (test de conduite obligatoire)",
    "Maîtriser Yango, Heetch ou une autre application VTC équivalente",
    "Maîtrise du français souhaitée",
    "Résider dans une des zones indiquées est un atout"
  ],
  contactEmail: "flotteplusrecrutement@gmail.com",
  contactPhone: "+221 77 766 68 12",
  keywords: [
    "VTC",
    "chauffeur privé",
    "Yango",
    "Heetch",
    "Dakar",
    "conduite",
    "shift nuit",
    "shift jour",
    "transport",
    "mobilité",
    "emploi chauffeur"
  ]
};

console.log('--- Début du script d\'insertion Chauffeur VTC Dakar ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, contactPhone: newJob.contactPhone });
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