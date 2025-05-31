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
  title: "Directeur des Ressources Humaines",
  company: "",
  location: "Kédougou, Sénégal",
  jobType: "Temps plein",
  sector: "Ressources Humaines / Secteur Minier",
  description: "Nous recherchons un(e) Directeur(trice) des Ressources Humaines pour rejoindre l'équipe d'un de nos clients, un acteur majeur du secteur minier. Le poste implique une gestion stratégique des RH, en lien avec les pratiques locales et les standards internationaux.",
  missions: [
    "Gestion stratégique des ressources humaines",
    "Mise en œuvre des politiques RH selon les standards internationaux",
    "Veille au respect des lois du travail au Sénégal",
    "Accompagnement des équipes et développement des talents",
    "Gestion des relations sociales et du dialogue social"
  ],
  requirements: [
    "Minimum 8 ans d'expérience en ressources humaines",
    "Au moins 3 ans à un poste de direction",
    "Expérience dans les secteurs minier, de la construction ou de l'industrie",
    "Connaissance approfondie des lois du travail au Sénégal",
    "Maîtrise courante du français et de l'anglais"
  ],
  contactEmail: "cv@topwork.sn",
  contactPhone: "",
  keywords: [
    "RH",
    "direction",
    "secteur minier",
    "Kédougou",
    "droit du travail",
    "anglais",
    "français",
    "TopWork"
  ]
};

console.log('--- Début du script d\'insertion DRH Kédougou ---');
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