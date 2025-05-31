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
  title: "Acheteur(se) Laboratoire",
  company: "DISLAB WEST AFRICA",
  location: "Dakar, Sénégal",
  jobType: "CDI",
  sector: "Distribution / Vente / Commerce de gros / Laboratoire",
  description: "DISLAB WEST AFRICA, filiale de DISLAB spécialisée dans la distribution d'équipements et consommables pour laboratoires, recherche un(e) Acheteur(se) Laboratoire pour optimiser ses achats et renforcer sa compétitivité. Poste basé à Dakar, sans télétravail.",
  missions: [
    "Consolider les commandes annuelles et négocier les meilleures conditions d'achat",
    "Identifier des alternatives produits/marques pour optimiser les marges",
    "Rechercher et évaluer de nouveaux fournisseurs",
    "Analyser les consommations clients et proposer des ventes croisées",
    "Suivre rigoureusement les achats et la performance des fournisseurs",
    "Travailler avec des fournisseurs internationaux (anglais professionnel requis)"
  ],
  requirements: [
    "Bac+3 minimum en chimie, biologie, physique ou domaine scientifique équivalent",
    "Spécialisation en achats ou expérience pertinente souhaitée",
    "Expérience en laboratoire (technicien, ingénieur, analyste)",
    "2 à 5 ans d'expérience dans un poste similaire ou en environnement scientifique",
    "Solides compétences en négociation et excellent relationnel",
    "Maîtrise d'Excel et des outils de gestion des achats",
    "Expérience en sourcing international est un atout",
    "Langues : français courant, anglais bon niveau"
  ],
  contactEmail: "contact@dislabwestafrica.com",
  contactPhone: "",
  keywords: [
    "acheteur",
    "laboratoire",
    "achats",
    "négociation",
    "équipements scientifiques",
    "sourcing",
    "Excel",
    "Dakar",
    "chimie",
    "biologie",
    "distribution",
    "gestion fournisseurs"
  ]
};

console.log('--- Début du script d\'insertion Acheteur(se) Laboratoire DISLAB ---');
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