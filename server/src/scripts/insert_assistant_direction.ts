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
  title: "Assistant(e) de direction",
  company: "Non précisé",
  location: "Non précisé",
  jobType: "Temps plein",
  sector: "Administration / Gestion / Direction / Secrétariat / ONG / Entreprise / Coordination",
  description: "L'assistant(e) de direction assure un soutien administratif et stratégique au directeur général ou dirigeant. Il/elle gère les calendriers, les déplacements, les communications internes et externes, les documents officiels, ainsi que l'organisation de réunions et d'événements. Il/elle coordonne également certains projets et assure la liaison avec les parties prenantes internes et externes.",
  missions: [
    "Gestion des calendriers et des déplacements du dirigeant",
    "Organisation de réunions, d'événements et de voyages",
    "Gestion des communications internes et externes",
    "Préparation et suivi des documents officiels",
    "Coordination de projets et suivi des parties prenantes",
    "Rédaction de rapports et de présentations",
    "Suivi budgétaire et financier (dépenses, rapports)",
    "Appui administratif quotidien"
  ],
  requirements: [
    "Licence en administration, gestion, communication ou domaine connexe",
    "Minimum 2 ans d'expérience dans un poste similaire",
    "Excellentes compétences organisationnelles, de communication et de gestion du temps",
    "Discrétion, sens de la confidentialité, capacité à gérer des priorités multiples",
    "Maîtrise de l'anglais et du français (écrit et oral)",
    "Bonne connaissance de Microsoft Office, Google Workspace et des outils de gestion de projet",
    "Capacité à rédiger des rapports et présentations",
    "Expérience dans des ONG, entreprises ou administrations : atout",
    "Aptitudes en planification de voyages et coordination d'événements",
    "Compétences en gestion budgétaire et financière (suivi des dépenses, préparation de rapports)"
  ],
  contactEmail: "assistant-direction@afrirh.odoo.com",
  contactPhone: "",
  keywords: [
    "assistant de direction",
    "administration",
    "gestion",
    "communication",
    "organisation",
    "bureautique",
    "coordination",
    "bilingue",
    "voyages",
    "événementiel",
    "rapports",
    "Microsoft Office",
    "Google Workspace",
    "ONG",
    "entreprise",
    "direction",
    "secrétariat exécutif"
  ]
};

console.log('--- Début du script d\'insertion Assistant(e) de direction ---');
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