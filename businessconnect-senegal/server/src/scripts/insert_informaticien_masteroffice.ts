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
  title: "Informaticien",
  company: "Master Office",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Informatique / Réseaux / Télécommunications",
  description: "Master Office est à la recherche d'un Informaticien qualifié, capable d'intervenir sur les réseaux et les télécommunications dans un environnement professionnel dynamique.",
  missions: [
    "Intervenir sur les réseaux et télécommunications de l'entreprise",
    "Assurer la maintenance informatique",
    "Participer à l'amélioration de l'infrastructure IT"
  ],
  requirements: [
    "Niveau : Bac +3 en Commerce International",
    "Maîtrise des réseaux et télécommunications"
  ],
  contactEmail: "recrutement@masteroffice.sn",
  contactPhone: "",
  keywords: [
    "informatique",
    "réseaux",
    "télécommunications",
    "Bac+3",
    "commerce international",
    "Master Office"
  ]
};

console.log('--- Début du script d\'insertion Informaticien Master Office ---');
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