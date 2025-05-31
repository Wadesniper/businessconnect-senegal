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
  title: "Responsable Adjoint MAS (H/F)",
  company: "Terrou-Bi",
  location: "Dakar - Sénégal",
  jobType: "Temps plein",
  sector: "Casino / Hôtellerie / Maintenance / Management",
  description: "Assurer le bon fonctionnement et la maintenance des machines à sous. Optimiser les performances et les revenus du parc. Suivre les statistiques d'exploitation et proposer des ajustements. Superviser les techniciens et partenaires dédiés aux machines à sous. Organiser les plannings de travail de l'équipe. Assurer la formation en collaboration avec la DRH. Veiller au respect des procédures de contrôle et de sécurité. Appliquer les normes légales et réglementations en vigueur. Contrôler la manipulation des fonds et encaissements. Fournir une assistance rapide aux clients en cas de dysfonctionnement. Répondre aux réclamations pour une expérience client optimale. Travailler en coordination avec les services internes (sécurité, accueil, comptabilité).",
  missions: [
    "Assurer le bon fonctionnement et la maintenance des machines à sous",
    "Optimiser les performances et les revenus du parc",
    "Suivre les statistiques d'exploitation et proposer des ajustements",
    "Superviser les techniciens et partenaires dédiés aux machines à sous",
    "Organiser les plannings de travail de l'équipe",
    "Assurer la formation en collaboration avec la DRH",
    "Veiller au respect des procédures de contrôle et de sécurité",
    "Appliquer les normes légales et réglementations en vigueur",
    "Contrôler la manipulation des fonds et encaissements",
    "Fournir une assistance rapide aux clients en cas de dysfonctionnement",
    "Répondre aux réclamations pour une expérience client optimale",
    "Travailler en coordination avec les services internes (sécurité, accueil, comptabilité)"
  ],
  requirements: [
    "Diplôme en gestion, exploitation des jeux, maintenance industrielle ou équivalent",
    "3 à 5 ans d'expérience dans un poste similaire, idéalement en hôtellerie/casino",
    "Connaissance des systèmes de jeux électroniques et de la réglementation",
    "Maîtrise des outils informatiques et logiciels de gestion de MAS",
    "Maîtrise du français, l'anglais est un plus",
    "Capacité à manager une équipe",
    "Sens du service client, rigueur, organisation, discrétion",
    "Disponible pour travailler de nuit et les week-ends",
    "Horaires : ouverture du casino de 11h à 5h du matin"
  ],
  contactEmail: "recrutement@terroubi.com",
  contactPhone: "",
  keywords: [
    "responsable adjoint",
    "machines à sous",
    "casino",
    "hôtellerie",
    "maintenance",
    "service client",
    "management",
    "nuit",
    "week-end",
    "Terrou-Bi",
    "Dakar"
  ]
};

console.log('--- Début du script d\'insertion Responsable Adjoint MAS ---');
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