const mongoose = require('mongoose');

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
  keywords: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Job = mongoose.model('Job', JobSchema);

const newJob = {
  title: "Agents Commerciaux en Immobilier (H/F)",
  company: "",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "",
  description: "Cibler, prospecter et faire visiter les potentiels clients.\nPromouvoir l'offre de produits immobiliers.\nDévelopper et fidéliser un portefeuille client.\nDétecter les opportunités de croissance.\nAssurer une veille du marché immobilier.\nAssurer un suivi commercial pour fidéliser les clients.\nÉlaborer des stratégies pour dynamiser les ventes.\nContribuer à la performance collective.\nMaîtriser le produit ou service proposé.\nComprendre les besoins des clients.\nNégocier et convaincre les clients ou partenaires potentiels.\nOrganiser et assurer le suivi commercial des clients.",
  missions: [
    "Cibler, prospecter et faire visiter les potentiels clients",
    "Promouvoir l'offre de produits immobiliers",
    "Développer et fidéliser un portefeuille client",
    "Détecter les opportunités de croissance",
    "Assurer une veille du marché immobilier",
    "Assurer un suivi commercial pour fidéliser les clients",
    "Élaborer des stratégies pour dynamiser les ventes",
    "Contribuer à la performance collective",
    "Maîtriser le produit ou service proposé",
    "Comprendre les besoins des clients",
    "Négocier et convaincre les clients ou partenaires potentiels",
    "Organiser et assurer le suivi commercial des clients"
  ],
  requirements: [
    "Expérience d'au moins 2 ans dans le domaine de l'immobilier",
    "Bonne maîtrise des techniques de vente et de négociation",
    "Sens de l'organisation, autonomie et esprit d'équipe",
    "Aisance relationnelle et orientation résultats"
  ],
  contactEmail: "recrutementimmodak@gmail.com",
  keywords: [
    "immobilier",
    "agent commercial",
    "vente",
    "prospection",
    "négociation",
    "suivi client",
    "stratégie commerciale",
    "expérience",
    "portefeuille client"
  ],
  isActive: true
};

async function insertAndCheckJob() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    let exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
    if (exists) {
      console.log('Offre déjà existante, aucune insertion.');
    } else {
      const result = await Job.create(newJob);
      console.log('Offre insérée :', result);
    }
    exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
    if (exists) {
      console.log('✅ Offre présente dans la base :', newJob.title, '|', newJob.contactEmail);
    } else {
      console.log('❌ Offre NON trouvée dans la base après insertion :', newJob.title, '|', newJob.contactEmail);
    }
    await mongoose.disconnect();
    console.log('Déconnexion MongoDB');
  } catch (err) {
    console.error('Erreur lors de l\'insertion ou de la vérification :', err);
    if (err instanceof Error) {
      console.error('Stack:', err.stack);
    }
  }
}

insertAndCheckJob(); 