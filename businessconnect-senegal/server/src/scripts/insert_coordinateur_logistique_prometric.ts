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
  title: "Coordinateur(trice) Logistique",
  company: "Prometric Offshore Services",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Logistique / Offshore / Gestion de projet / HSE",
  description: "Dans le cadre de ses activités au Sénégal, Prometric Offshore Services recherche un(e) Coordinateur(trice) Logistique, rigoureux(se) et réactif(ve), pour assurer le bon fonctionnement des opérations terrain et le suivi logistique de nos équipes en mission offshore. Offre exclusivement destinée aux ressortissants sénégalais. Maîtrise de l'anglais obligatoire.",
  missions: [
    "Coordonner l'exécution des contrats chez les clients et assurer la fluidité des opérations",
    "Gérer les stocks de matériel : réception, rangement, distribution et inventaire",
    "Assurer l'approvisionnement en équipements nécessaires pour les équipes sur site",
    "Être l'interlocuteur opérationnel entre Prometric, les clients et les fournisseurs",
    "Participer à la planification et à l'exécution des projets dans le respect des délais et des budgets",
    "Veiller au respect des normes HSE et de la réglementation en vigueur",
    "Travailler en synergie avec les autres départements pour améliorer les processus internes"
  ],
  requirements: [
    "Expérience significative en logistique ou en coordination de projets, idéalement dans un environnement offshore ou industriel",
    "Organisation, autonomie, sens des responsabilités",
    "Bon relationnel et capacité à travailler sous pression",
    "Français courant et anglais obligatoire (oral et écrit)",
    "Bonne maîtrise des outils bureautiques, en particulier Excel"
  ],
  contactEmail: "recruitment@prometricservices.com",
  contactPhone: "",
  keywords: [
    "Coordinateur logistique",
    "offshore",
    "logistique",
    "gestion de stocks",
    "anglais",
    "HSE",
    "Excel",
    "gestion de projet"
  ]
};

console.log('--- Début du script d\'insertion Coordinateur Logistique Prometric ---');
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