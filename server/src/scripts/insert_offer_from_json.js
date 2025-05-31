const fs = require('fs');
const path = require('path');
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

// Affichage du dossier courant
console.log('Dossier courant :', process.cwd());

// Construction du chemin absolu vers offer.json
const offerPath = path.resolve(__dirname, 'offer.json');
console.log('Lecture du fichier :', offerPath);

// Lecture de l'offre depuis offer.json
let newJob;
try {
  const data = fs.readFileSync(offerPath, 'utf-8');
  newJob = JSON.parse(data);
  console.log('Offre lue avec succès.');
} catch (err) {
  console.error('Erreur lors de la lecture ou du parsing de offer.json :', err);
  process.exit(1);
}

async function insertOneJob() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    // Vérification d'unicité sur le titre + contactEmail
    const exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
    if (exists) {
      console.log('Offre déjà existante, aucune insertion.');
    } else {
      const result = await Job.create(newJob);
      console.log('Offre insérée :', result);
    }
    await mongoose.disconnect();
    console.log('Déconnexion MongoDB');
  } catch (err) {
    console.error('Erreur lors de l\'insertion :', err);
    if (err instanceof Error) {
      console.error('Stack:', err.stack);
    }
  }
}

insertOneJob(); 