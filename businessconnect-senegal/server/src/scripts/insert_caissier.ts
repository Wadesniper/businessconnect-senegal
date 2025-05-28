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
  title: "Caissier / Caissière",
  company: "Non précisé",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Caisse / Vente / Commerce / Service client / Encaissement / Organisation",
  description: "Le caissier ou la caissière est chargé(e) d'encaisser les produits vendus via un système de caisse, de traiter les différents modes de paiement conformément aux règles du magasin, et de tenir un journal de caisse. Il/elle rend compte des ventes effectuées, trie les paiements selon leur mode, et en fait le total. Il/elle s'assure également de la validité des produits, renseigne les clients, propose des sacs de course si besoin, et veille à ce que le magasin reste bien rangé et organisé.",
  missions: [
    "Encaisser les produits vendus via le système de caisse",
    "Traiter les différents modes de paiement (espèces, carte, mobile money, etc.)",
    "Tenir un journal de caisse et rendre compte des ventes",
    "Trier et totaliser les paiements selon leur mode",
    "S'assurer de la validité des produits et renseigner les clients",
    "Proposer des sacs de course si besoin",
    "Veiller à la propreté et à l'organisation de l'espace de travail et du magasin"
  ],
  requirements: [
    "Expérience en caisse souhaitée",
    "Rigueur et fiabilité dans la gestion des paiements",
    "Sens du service client",
    "Bonne présentation et aisance relationnelle",
    "Capacité à maintenir un espace de travail propre et ordonné"
  ],
  contactEmail: "habsatou.niang@yahoo.fr",
  contactPhone: "",
  keywords: [
    "caisse",
    "encaissement",
    "service client",
    "vente",
    "organisation",
    "commerce",
    "paiement"
  ]
};

console.log('--- Début du script d\'insertion Caissier / Caissière ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, location: newJob.location, contactEmail: newJob.contactEmail });
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