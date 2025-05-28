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
  title: "Vendeur(se)",
  company: "",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Vente",
  description: "Accueillir et conseiller les clients.\nPromouvoir les produits de l'entreprise.\nUtiliser les outils numériques et applications de communication pour faciliter les échanges commerciaux.",
  missions: [
    "Accueillir et conseiller les clients",
    "Promouvoir les produits de l'entreprise",
    "Utiliser les outils numériques et applications de communication pour faciliter les échanges commerciaux"
  ],
  requirements: [
    "Dynamique, extraverti(e) et passionné(e)",
    "Aisance dans l'expression orale",
    "Expérience préalable en vente ou commerce",
    "Maîtrise des outils bureautiques et applications comme WhatsApp",
    "Réactif(ve), adaptable et résistant(e) au stress"
  ],
  contactEmail: "charotte@1688.tech",
  keywords: [
    "vente",
    "commerce",
    "relation client",
    "WhatsApp",
    "outils numériques",
    "dynamique",
    "vendeur",
    "communication"
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