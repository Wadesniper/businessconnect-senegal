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
  title: "Chauffeurs titulaires des permis C et D (08 postes)",
  company: "",
  location: "Diack (près de Touba Toul), Sénégal",
  jobType: "Temps plein, mission de transport régulier",
  sector: "Transport / Logistique / Routier / Chauffeur / Sénégal",
  description: "Dans le cadre d'une mission de transport régulier, nous recrutons huit (8) chauffeurs titulaires des permis C et D. Les chauffeurs effectueront des trajets quotidiens entre Diack et Rosso Mauritanie, avec un rythme de 6 jours sur 7. Date de démarrage : 12 mai 2025. Heure de présence exigée : 07h00 sur site pour le chargement.",
  missions: [
    "Effectuer des trajets quotidiens entre Diack et Rosso Mauritanie",
    "Assurer le transport régulier selon le planning établi",
    "Être présent sur site à 07h00 pour le chargement"
  ],
  requirements: [
    "Être titulaire du permis C et permis D",
    "Être ponctuel, rigoureux et apte à travailler sous pression",
    "Avoir de l'expérience dans la conduite longue distance est un atout"
  ],
  contactEmail: "cv@amdcorporate.net",
  contactPhone: "",
  keywords: [
    "chauffeur",
    "permis C",
    "permis D",
    "transport régulier",
    "Rosso",
    "Touba",
    "Diack",
    "Sénégal",
    "logistique",
    "routier"
  ]
};

console.log('--- Début du script d\'insertion Chauffeurs permis C et D Diack ---');
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