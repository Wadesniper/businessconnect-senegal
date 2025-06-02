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
  title: "Chef pâtissier (H/F)",
  company: "",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "",
  description: "Préparer et élaborer des pâtisseries de haute qualité.\nGérer les stocks et les coûts.\nSuperviser le travail des autres pâtissiers et confiseurs.\nAssurer la satisfaction client par la qualité des produits.\nVeiller à l'organisation et à la rigueur de la production.",
  missions: [
    "Préparer et élaborer des pâtisseries de haute qualité",
    "Gérer les stocks et les coûts",
    "Superviser le travail des autres pâtissiers et confiseurs",
    "Assurer la satisfaction client par la qualité des produits",
    "Veiller à l'organisation et à la rigueur de la production"
  ],
  requirements: [
    "Titulaire d'un BT/BTS en hôtellerie-restauration, pâtissier-confiseur glacier-traiteur",
    "Expérience minimum de 3 ans en tant que Chef Pâtissier Adjoint ou Chef de Pâtisserie",
    "Maîtrise des techniques culinaires en pâtisserie, boulangerie, travail du sucre et du chocolat",
    "Maîtrise de la gestion des stocks et des coûts",
    "Compétences en informatique",
    "Créativité, sens relationnel, souci de la satisfaction client",
    "Organisation, rigueur, souci du détail",
    "Esprit d'initiative, disponibilité, humilité"
  ],
  contactEmail: "recrutement@terroubi.com",
  keywords: [
    "Chef pâtissier",
    "pâtisserie",
    "hôtellerie",
    "BTS",
    "cuisine",
    "gestion des stocks",
    "chocolat",
    "sucre",
    "créativité",
    "rigueur",
    "disponibilité"
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