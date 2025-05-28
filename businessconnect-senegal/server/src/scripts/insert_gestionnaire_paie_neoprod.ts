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
  title: "Gestionnaire de Paie Confirmé(e)",
  company: "Neoprod International",
  location: "Dakar, Sénégal",
  jobType: "CDI (à confirmer)",
  sector: "Paie / Comptabilité / Fiscalité / RH / Administration du personnel / Externalisation",
  description: "Neoprod International, société spécialisée dans l'externalisation des tâches pour les cabinets d'expertise comptable depuis 27 ans, avec plus de 300 collaborateurs répartis en France, au Portugal, en Tunisie et au Sénégal, recrute plusieurs Gestionnaires de Paie confirmés. Vous serez en charge de la gestion administrative des paies françaises au sein d'une équipe dynamique. Une formation continue à la paie française ainsi qu'un accompagnement sont prévus pour vous faire progresser.",
  missions: [
    "Collecte et vérification des données nécessaires à l'établissement de la paie",
    "Préparation et calcul des bulletins de paie",
    "Gestion des déclarations sociales et fiscales mensuelles, trimestrielles et annuelles",
    "Assurer la conformité avec les réglementations fiscales et sociales",
    "Administration des dossiers du personnel (entrées, sorties, modifications contractuelles)",
    "Gestion des avantages sociaux et des régimes de retraite",
    "Conseil aux employés sur les questions de paie, retenues et avantages",
    "Veille juridique et réglementaire"
  ],
  requirements: [
    "Diplôme en paie, gestion, comptabilité, finance ou domaine similaire",
    "Niveau d'études : Bac+3 (Licence)",
    "Minimum 1 an d'expérience en gestion de paie française",
    "Rigueur, sens de l'organisation et gestion des priorités"
  ],
  contactEmail: "ibrahima.diouf@mrsys.fr",
  contactPhone: "",
  keywords: [
    "gestionnaire de paie",
    "paie française",
    "comptabilité",
    "fiscalité",
    "RH",
    "administration du personnel",
    "Dakar",
    "externalisation",
    "Neoprod"
  ]
};

console.log('--- Début du script d\'insertion Gestionnaire de Paie Confirmé(e) Neoprod ---');
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