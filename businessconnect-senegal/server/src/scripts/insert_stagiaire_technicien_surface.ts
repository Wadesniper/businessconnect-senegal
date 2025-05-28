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
  title: "Stagiaires Techniciens de Surface",
  company: "Egard Global Service",
  location: "Non précisé",
  jobType: "Stage",
  sector: "Nettoyage / Désinfection / Désinsectisation / Dératisation / Fumigation / Stage",
  description: "Assurer le nettoyage, la désinfection, désinsectisation, dératisation, déreptilisation et fumigation des locaux. Respecter le règlement intérieur de l'entreprise. Faire un rapport journalier après chaque prestation. Entretenir les locaux et les matériels.",
  missions: [
    "Assurer le nettoyage, la désinfection, désinsectisation, dératisation, déreptilisation et fumigation des locaux",
    "Respecter le règlement intérieur de l'entreprise",
    "Faire un rapport journalier après chaque prestation",
    "Entretenir les locaux et les matériels"
  ],
  requirements: [
    "Minimum niveau BFEM",
    "Expérience en nettoyage et pulvérisation serait un atout",
    "Disponibilité, réactivité et passion pour le métier"
  ],
  contactEmail: "recrutementrgs4@gmail.com",
  contactPhone: "",
  keywords: [
    "technicien de surface",
    "nettoyage",
    "désinfection",
    "désinsectisation",
    "dératisation",
    "fumigation",
    "stage"
  ]
};

console.log('--- Début du script d\'insertion Stagiaires Techniciens de Surface ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, company: newJob.company, jobType: newJob.jobType });
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