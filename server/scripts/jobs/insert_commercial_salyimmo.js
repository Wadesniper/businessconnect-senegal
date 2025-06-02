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
  title: "Commercial (H/F)",
  company: "SALY IMMO SÉNÉGAL",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "",
  description: "Commercialiser les biens immobiliers de l'agence.\nAssurer la prospection de nouveaux clients.\nOrganiser et effectuer les visites de biens.\nConseiller les clients et les accompagner dans leurs démarches.\nNégocier les offres et conclure les ventes.",
  missions: [
    "Commercialiser les biens immobiliers de l'agence",
    "Assurer la prospection de nouveaux clients",
    "Organiser et effectuer les visites de biens",
    "Conseiller les clients et les accompagner dans leurs démarches",
    "Négocier les offres et conclure les ventes"
  ],
  requirements: [
    "Expérience en vente ou dans le secteur immobilier (recommandé)",
    "Sens du relationnel, dynamisme et esprit d'équipe",
    "Bonne présentation et capacité à convaincre"
  ],
  contactEmail: "78 475 57 56",
  keywords: [
    "immobilier",
    "commercial",
    "vente",
    "prospection",
    "Saly",
    "négociation",
    "relation client"
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