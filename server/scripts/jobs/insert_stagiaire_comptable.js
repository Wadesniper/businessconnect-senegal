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
  title: "Stagiaire Comptable",
  company: "",
  location: "Sénégal",
  jobType: "Stage",
  sector: "",
  description: "Assister à la gestion comptable de l'entreprise.\nParticiper aux tâches administratives liées à la comptabilité.\nSoutenir l'équipe dans le suivi des opérations financières.",
  missions: [
    "Assister à la gestion comptable de l'entreprise",
    "Participer aux tâches administratives liées à la comptabilité",
    "Soutenir l'équipe dans le suivi des opérations financières"
  ],
  requirements: [
    "Formation en comptabilité (niveau non précisé)",
    "Disponibilité immédiate",
    "Intérêt pour le secteur de la grande distribution"
  ],
  contactEmail: "afs09735@gmail.com",
  keywords: [
    "comptabilité",
    "stage",
    "grande distribution",
    "finances",
    "assistance",
    "comptable",
    "disponibilité immédiate"
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