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

// Offre à insérer (remplace ici à chaque nouvelle offre)
const newJob = {
  title: "Livreurs (H/F)",
  company: "Makkity International",
  location: "Dakar, Sénégal",
  jobType: "CDD, temps plein",
  sector: "",
  description: "Livraison de colis/produits chez les clients dans la région de Dakar.\nRespect des délais de livraison et des consignes de sécurité.\nGestion de l'itinéraire et optimisation des trajets.\nInteraction courtoise et professionnelle avec les clients.",
  missions: [
    "Livraison de colis/produits chez les clients dans la région de Dakar",
    "Respect des délais de livraison et des consignes de sécurité",
    "Gestion de l'itinéraire et optimisation des trajets",
    "Interaction courtoise et professionnelle avec les clients"
  ],
  requirements: [
    "Permis de conduire",
    "Expérience dans la livraison (un plus)",
    "Bonne organisation, ponctualité et sens du service client",
    "Capacité à travailler de manière autonome"
  ],
  contactEmail: "778481313",
  keywords: [
    "livreur",
    "livraison",
    "Dakar",
    "permis de conduire",
    "ponctualité",
    "service client",
    "CDD",
    "itinéraire",
    "sécurité",
    "flexibilité"
  ],
  isActive: true
};

async function insertAndCheckJob() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    // Vérification d'unicité sur le titre + contactEmail
    let exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
    if (exists) {
      console.log('Offre déjà existante, aucune insertion.');
    } else {
      const result = await Job.create(newJob);
      console.log('Offre insérée :', result);
    }
    // Vérification immédiate
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