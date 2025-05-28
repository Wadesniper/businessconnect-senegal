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
  title: "Agent Technico-Commercial",
  company: "Easy Tech Group",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Vente / Technique / B2B",
  description: "Un agent technico-commercial est chargé de vendre des produits et services techniques complexes aux entreprises ou aux particuliers. Il fait le lien entre les clients et l'équipe technique, s'assurant que ces derniers comprennent comment un produit répond à leurs besoins. Ce rôle requiert un mélange de connaissances techniques et d'expertise commerciale pour communiquer efficacement la valeur du produit et conclure des affaires.",
  missions: [
    "Vendre des produits et services techniques",
    "Faire le lien entre les clients et l'équipe technique",
    "Comprendre les besoins des clients et proposer des solutions adaptées",
    "Communiquer la valeur du produit et conclure des affaires"
  ],
  requirements: [
    "Bonnes connaissances techniques sur les produits ou services à vendre",
    "Compétences commerciales et en négociation",
    "Capacité à comprendre les besoins des clients et à proposer des solutions adaptées",
    "Excellentes compétences en communication orale et écrite",
    "Sens de l'écoute et du service client",
    "Expérience dans un poste similaire souhaitée",
    "Autonomie et capacité à travailler en équipe"
  ],
  contactEmail: "recrutement@easytechgroup.net",
  contactPhone: "",
  keywords: [
    "technico-commercial",
    "vente B2B",
    "produits techniques",
    "relation client",
    "support technique",
    "négociation",
    "communication"
  ]
};

console.log('--- Début du script d\'insertion Agent Technico-Commercial ---');
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