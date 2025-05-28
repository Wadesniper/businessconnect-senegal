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
  title: "Télévendeur(se) Expérimenté(e)",
  company: "Mon Assistant Perso",
  location: "Dakar",
  jobType: "CDD - Intérim - Stage",
  sector: "Centres d'appel / Hotline / Call center",
  description: "Dans le cadre du développement de ses activités, le groupe Mon Assistant Perso recrute des Télévendeurs(ses) expérimenté(e)s pour des campagnes en énergie, mobile et mutuelle. Vous serez chargé(e) de convaincre des prospects qualifiés par téléphone et d'atteindre vos objectifs commerciaux.",
  missions: [
    "Convaincre des prospects qualifiés par téléphone",
    "Atteindre les objectifs commerciaux fixés"
  ],
  requirements: [
    "Expérience obligatoire sur les campagnes dépannage, énergie, mutuelle",
    "Maîtrise des techniques de télévente",
    "Bonne capacité à atteindre les objectifs fixés",
    "Aisance téléphonique et excellent sens de la communication"
  ],
  contactEmail: "contact@mon-assistant-perso.fr",
  contactPhone: "",
  keywords: [
    "télévente",
    "télévendeur",
    "énergie",
    "mutuelle",
    "call center",
    "Dakar",
    "centre d'appel",
    "vente par téléphone",
    "commercial",
    "objectif",
    "CDD"
  ]
};

console.log('--- Début du script d\'insertion Télévendeur(se) Expérimenté(e) Mon Assistant Perso ---');
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