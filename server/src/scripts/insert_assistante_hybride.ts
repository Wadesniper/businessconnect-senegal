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
  title: "Assistante Hybride (de Direction et Personnelle)",
  company: "Eazy-Visa",
  location: "Dakar, Sénégal",
  jobType: "CDI (poste évolutif)",
  sector: "Administration / Gestion / Immobilier",
  description: "Nous recherchons une Assistante Hybride (de Direction et Personnelle) polyvalente, rigoureuse et dynamique. Ce poste combine gestion administrative et soutien personnel, avec un rôle clé dans la gestion des affaires professionnelles et privées de son employeur. L'assistante travaillera sur Eazy-Visa, gérera la comptabilité personnelle, la gestion immobilière, et assurera un suivi efficace de plusieurs projets en cours. Elle devra également représenter dignement son employeur lors de certains événements.",
  missions: [
    "Gérer l'agenda professionnel et personnel",
    "Gérer les emails, courriers et appels",
    "Organiser les déplacements et rendez-vous",
    "Rédiger des comptes rendus et documents administratifs",
    "Gérer les projets en lien avec Eazy-Visa",
    "Suivre les biens immobiliers et les réparations",
    "Coordonner les prestataires externes",
    "Assister dans la gestion d'Eazy-Visa et le suivi des clients",
    "Participer à des événements professionnels"
  ],
  requirements: [
    "Excellente maîtrise du français et de l'anglais (oral et écrit)",
    "Maîtrise des outils numériques (gestion, bureautique, comptabilité)",
    "Très bonne présentation et professionnalisme",
    "Excellent relationnel et sens de la communication"
  ],
  contactEmail: "drh@eazy-visa.com",
  contactPhone: "",
  keywords: [
    "assistante de direction",
    "poste hybride",
    "gestion personnelle",
    "eazy-visa",
    "gestion administrative",
    "gestion immobilière",
    "bilingue",
    "Dakar",
    "recrutement 2025"
  ]
};

async function insertOneJob() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    const exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
    if (exists) {
      console.log('Offre déjà existante, aucune insertion.');
    } else {
      const result = await Job.create(newJob);
      console.log('Offre insérée :', result);
    }
    await mongoose.disconnect();
    console.log('Déconnexion MongoDB');
  } catch (err) {
    console.error('Erreur lors de l\'insertion :', err);
    if (err instanceof Error) {
      console.error('Stack:', err.stack);
    }
  }
}

insertOneJob(); 