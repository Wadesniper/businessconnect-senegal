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
  title: "Commercial",
  company: "KMI HR PARTNERS",
  location: "Dakar",
  jobType: "CDD - Stage",
  sector: "BTP / Construction / Vente / Matériaux / Restauration",
  description: "Nous recrutons des Commerciaux pour développer et entretenir des relations avec les clients dans l'industrie des matériaux de construction ou de la restauration. Missions : prospection, négociation, suivi client, logistique, tâches administratives, participation à des événements, etc.",
  missions: [
    "Développer et entretenir des relations avec les clients nouveaux et existants",
    "Identifier les clients potentiels et rechercher activement des opportunités de vente",
    "Réaliser des études et analyses de marché",
    "Présenter et démontrer les produits",
    "Négocier et conclure des contrats de vente",
    "Gérer la relation après-vente et la satisfaction client",
    "Collaborer avec l'équipe marketing sur des campagnes promotionnelles",
    "Préparer des rapports de ventes, projections de revenus, pipelines, etc.",
    "Suivre les évolutions du marché, de la réglementation et des produits",
    "Participer à des salons professionnels, événements ou conférences",
    "Assurer la logistique liée à la livraison et à la réception des marchandises ou conteneurs à Dakar",
    "Gérer certaines tâches administratives comme les réponses aux appels d'offres ou demandes d'agrément"
  ],
  requirements: [
    "Expérience confirmée en vente, idéalement dans les matériaux de construction ou la restauration",
    "Diplôme en administration, marketing ou domaine connexe",
    "Maîtrise de la communication, négociation et gestion de relations",
    "Sens du service client et capacité à fidéliser",
    "Motivation, autonomie et orientation résultats",
    "Maîtrise de MS Office, Google Apps et logiciels CRM",
    "Maîtrise du français et de l'anglais à l'écrit comme à l'oral",
    "Permis de conduire valide et disponibilité pour voyager au Sénégal"
  ],
  contactEmail: "km-international.infos@kmints.com",
  contactPhone: "",
  keywords: [
    "commercial",
    "BTP",
    "matériaux de construction",
    "vente",
    "CRM",
    "logistique",
    "anglais",
    "négociation",
    "relation client",
    "marketing"
  ]
};

console.log('--- Début du script d\'insertion Commercial KMI HR PARTNERS ---');
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