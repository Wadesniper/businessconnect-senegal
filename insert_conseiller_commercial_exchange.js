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
  title: "Conseiller Commercial en Émission d'Appels",
  company: "Exchange-Groupe",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "",
  description: "Assurer des appels sortants dans le cadre de la vente de services liés à la téléphonie et à l'énergie.\nConseiller les clients potentiels et proposer les offres adaptées.\nAtteindre les objectifs de vente fixés.\nGarantir une qualité d'échange et un bon relationnel client.",
  missions: [
    "Assurer des appels sortants dans le cadre de la vente de services liés à la téléphonie et à l'énergie",
    "Conseiller les clients potentiels et proposer les offres adaptées",
    "Atteindre les objectifs de vente fixés",
    "Garantir une qualité d'échange et un bon relationnel client"
  ],
  requirements: [
    "Expérience préalable dans un centre d'appel, idéalement dans les secteurs télécom et énergie",
    "Excellente communication orale",
    "Bonne capacité d'écoute et de persuasion"
  ],
  contactEmail: "recrutement@exchange-groupe.com",
  keywords: [
    "centre d'appel",
    "téléphonie",
    "énergie",
    "conseiller commercial",
    "appels sortants",
    "relation client",
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