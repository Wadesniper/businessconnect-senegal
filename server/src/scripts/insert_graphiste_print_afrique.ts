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
  title: "Graphiste Print",
  company: "",
  location: "Sénégal / Afrique (coordination multinationale)",
  jobType: "Temps plein",
  sector: "Graphisme / Print / Design / Communication visuelle / Publicité / PLV / Afrique",
  description: "Gérer l'ensemble des besoins print du client. Décliner les campagnes panafricaines dans différents formats (4×3, Abribus, Affichettes, PLV…) et devises pour 25 pays d'Afrique. Prendre en charge la création print des besoins locaux (leaflets, roll-ups…). Développer le matériel événementiel (signalétique, drapeaux, goodies…). Garantir la bonne utilisation de la charte graphique sur tous les canaux.",
  missions: [
    "Gérer l'ensemble des besoins print du client",
    "Décliner les campagnes panafricaines dans différents formats et devises pour 25 pays d'Afrique",
    "Créer les supports print locaux (leaflets, roll-ups, etc.)",
    "Développer le matériel événementiel (signalétique, drapeaux, goodies, etc.)",
    "Garantir la bonne utilisation de la charte graphique sur tous les canaux"
  ],
  requirements: [
    "Diplôme d'une école de graphisme",
    "Parfaite maîtrise de la suite Adobe Creative Cloud, notamment InDesign",
    "Solide maîtrise de la chaîne graphique print : création de gabarits, chemins de fer, assemblage de fichiers, export HD",
    "Maîtrise des règles de colorimétrie print",
    "Créatif(ve), rigoureux(se), organisé(e)",
    "Ouverture d'esprit, humilité, esprit d'équipe",
    "Intérêt pour les contenus cinéma, séries, sport",
    "Veille constante sur les outils créatifs et les tendances graphiques print et digitales"
  ],
  contactEmail: "eliterhrecrutement@gmail.com",
  contactPhone: "",
  keywords: [
    "graphiste",
    "print",
    "InDesign",
    "Adobe",
    "design graphique",
    "PLV",
    "campagne publicitaire",
    "Afrique",
    "création visuelle",
    "signalétique",
    "goodies",
    "colorimétrie",
    "communication visuelle"
  ]
};

console.log('--- Début du script d\'insertion Graphiste Print Afrique ---');
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