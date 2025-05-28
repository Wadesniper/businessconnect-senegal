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
  title: "Responsable des Ressources Humaines",
  company: "",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Ressources Humaines / Gestion / Droit du travail",
  description: "Le poste de Responsable des Ressources Humaines nécessite des compétences techniques approfondies en droit du travail et en gestion des ressources humaines. Le candidat devra également démontrer des capacités interpersonnelles solides pour gérer les relations avec les employés et diriger une équipe de manière efficace. Ce rôle implique la gestion de multiples tâches et priorités tout en maintenant une approche proactive et organisée.",
  missions: [
    "Gérer les relations avec les employés",
    "Superviser l'équipe RH et les processus de recrutement",
    "Assurer la conformité avec le droit du travail",
    "Mettre en place et suivre les politiques RH",
    "Gérer les conflits et accompagner le développement des collaborateurs"
  ],
  requirements: [
    "Diplôme en ressources humaines, gestion ou domaine connexe",
    "Minimum 3 ans d'expérience dans un poste similaire",
    "Connaissance approfondie du droit du travail et des pratiques RH",
    "Maîtrise des logiciels RH et des systèmes de gestion des informations RH",
    "Excellentes capacités de communication et de négociation",
    "Compétences en gestion d'équipe, résolution de problèmes et prise de décision",
    "Intégrité, proactivité et sens de l'organisation"
  ],
  contactEmail: "rh.galionsn@gmail.com",
  contactPhone: "",
  keywords: [
    "responsable des ressources humaines",
    "droit du travail",
    "gestion des RH",
    "communication",
    "gestion d'équipe",
    "intégrité",
    "proactivité",
    "Dakar",
    "recrutement"
  ]
};

console.log('--- Début du script d\'insertion Responsable RH ---');
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