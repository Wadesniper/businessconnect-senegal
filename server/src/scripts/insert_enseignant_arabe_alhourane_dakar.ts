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
  title: "Enseignant(e) d'Arabe / Alhourane (Yasseyda, Yasseydi ou Oustaz)",
  company: "",
  location: "Dieuppeul et HLM, Dakar, Sénégal",
  jobType: "Temps plein",
  sector: "Enseignement / Arabe / Alhourane / Éducation religieuse / Dakar",
  description: "Nous recherchons 2 Yasseyda, Yasseydi ou Oustaz pour enseigner l'arabe ou le Alhourane. Une augmentation de salaire est possible en fonction de l'expérience.",
  missions: [],
  requirements: [
    "Posséder un diplôme CEAP ou une expérience avérée dans l'enseignement de l'arabe ou du Alhourane",
    "Résider dans les environs de Dieuppeul ou des HLM"
  ],
  contactEmail: "",
  contactPhone: "+221 775 688 975",
  keywords: [
    "enseignant arabe",
    "oustaz",
    "yasseyda",
    "yasseydi",
    "alhourane",
    "CEAP",
    "enseignement religieux",
    "Dieuppeul",
    "HLM",
    "Dakar",
    "emploi éducation"
  ]
};

console.log('--- Début du script d\'insertion Enseignant(e) d\'Arabe / Alhourane Dakar ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, contactPhone: newJob.contactPhone });
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