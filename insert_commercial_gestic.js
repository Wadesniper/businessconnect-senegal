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
  title: "Commercial(e)",
  company: "Cabinet Gestic",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "",
  description: "Développer et promouvoir les services de l'entreprise.\nIdentifier et prospecter de nouveaux clients.\nPrésenter les offres de services aux prospects et clients.\nAssurer le suivi des relations commerciales.",
  missions: [
    "Développer et promouvoir les services de l'entreprise",
    "Identifier et prospecter de nouveaux clients",
    "Présenter les offres de services aux prospects et clients",
    "Assurer le suivi des relations commerciales"
  ],
  requirements: [
    "Expérience en commerce ou vente de services (non précisé, mais recommandé)",
    "Aisance relationnelle, capacité de négociation",
    "Esprit d'initiative et autonomie"
  ],
  contactEmail: "contact@cabinetgestic.com",
  keywords: [
    "commercial",
    "prospection",
    "services",
    "relation client",
    "développement commercial",
    "vente"
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