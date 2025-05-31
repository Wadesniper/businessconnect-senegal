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
  title: "Responsable de la communication",
  company: "Non précisé",
  location: "Sénégal",
  jobType: "Temps plein",
  sector: "Communication / Marketing / Relations publiques / ONG / Médias / Digital / Branding / Événementiel",
  description: "Le/la responsable de la communication aura pour mission d'élaborer et de mettre en œuvre une stratégie de communication globale visant à renforcer la visibilité de l'organisation et à engager efficacement les parties prenantes. Il/elle interviendra sur la stratégie de contenu, les relations médias, les réseaux sociaux, la communication interne, les événements, ainsi que l'image de marque.",
  missions: [
    "Élaboration et mise en œuvre de la stratégie de communication globale",
    "Gestion des relations médias et des partenariats presse",
    "Développement et gestion de la stratégie de contenu (rédaction, édition, storytelling)",
    "Gestion et animation des réseaux sociaux",
    "Organisation et coordination d'événements internes et externes",
    "Gestion de la communication interne et de l'image de marque",
    "Production de rapports, bulletins et supports de communication",
    "Gestion de la communication de crise",
    "Formation et accompagnement des équipes et partenaires en communication",
    "Suivi budgétaire et gestion financière des activités de communication"
  ],
  requirements: [
    "Licence en communication, journalisme, marketing, relations publiques ou domaine connexe",
    "Qualification post-universitaire : atout",
    "Minimum 5 ans d'expérience dans un poste similaire",
    "Excellentes compétences en rédaction, édition, communication orale",
    "Expérience dans la gestion des réseaux sociaux et création de contenu",
    "Maîtrise de MS Office ; outils graphiques comme Canva ou Adobe Suite : un plus",
    "Compétences en planification d'événements, production de rapports et bulletins",
    "Maîtrise de l'anglais et du français (écrit et oral)",
    "Expérience dans la communication pour les ONG ou organisations similaires",
    "Compétences en gestion financière, suivi budgétaire des activités de communication",
    "Expérience en communication de crise, storytelling, production vidéo",
    "Capacité à former les équipes et partenaires en communication",
    "Sens de l'organisation, créativité, leadership et capacité de travail en autonomie"
  ],
  contactEmail: "com@afrirh.odoo.com",
  contactPhone: "",
  keywords: [
    "communication",
    "stratégie",
    "relations médias",
    "marketing digital",
    "contenu",
    "réseaux sociaux",
    "branding",
    "événementiel",
    "rédaction",
    "ONG",
    "gestion de projet",
    "storytelling",
    "bilingue",
    "Canva",
    "Adobe",
    "communication interne",
    "presse",
    "formation",
    "leadership"
  ]
};

console.log('--- Début du script d\'insertion Responsable de la communication ---');
async function insertOneJob() {
  try {
    console.log('Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, { dbName: 'businessconnect' });
    console.log('Connecté à MongoDB');
    console.log('Recherche d\'une offre existante...');
    const exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
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