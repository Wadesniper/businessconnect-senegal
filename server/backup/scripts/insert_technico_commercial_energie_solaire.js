"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = "mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority";
const JobSchema = new mongoose_1.default.Schema({
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
const Job = mongoose_1.default.model('Job', JobSchema);
const newJob = {
    title: "Technico-Commercial en Énergie Solaire",
    company: "",
    location: "Dakar",
    jobType: "Stage",
    sector: "Électricité / Eau / Gaz / Nucléaire / Énergie / Solaire",
    description: "Ce professionnel junior possède un savoir-faire commercial ainsi que des compétences techniques en énergie solaire photovoltaïque. Missions : prospection, études techniques, négociation de devis, suivi client et SAV.",
    missions: [
        "Prospecter, développer et gérer un portefeuille client",
        "Réaliser des études techniques de faisabilité",
        "Élaborer et négocier des devis",
        "Assurer le suivi client et le service après-vente"
    ],
    requirements: [
        "Formation en Énergies Renouvelables",
        "Bonne maîtrise des solutions énergétiques : solaire, batteries, onduleurs",
        "Compétences en prospection, négociation et conseil client",
        "Dynamisme, autonomie et bon relationnel",
        "Capacité à suivre les ventes et à fournir un accompagnement technique de qualité"
    ],
    contactEmail: "contact@jantbienergy.com",
    contactPhone: "",
    keywords: [
        "énergie solaire",
        "technico-commercial",
        "photovoltaïque",
        "vente",
        "prospection",
        "énergies renouvelables",
        "Dakar",
        "stage"
    ]
};
console.log('--- Début du script d\'insertion Technico-Commercial Énergie Solaire ---');
async function insertOneJob() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        console.log('Recherche d\'une offre existante...');
        const exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
        if (exists) {
            console.log('Offre déjà existante, aucune insertion.');
        }
        else {
            console.log('Aucune offre existante trouvée, insertion en cours...');
            const result = await Job.create(newJob);
            console.log('Offre insérée :', result);
        }
        await mongoose_1.default.disconnect();
        console.log('Déconnexion MongoDB');
        console.log('--- Fin du script d\'insertion ---');
    }
    catch (err) {
        console.error('Erreur lors de l\'insertion :', err);
        if (err instanceof Error) {
            console.error('Stack:', err.stack);
        }
        console.log('--- Fin du script d\'insertion avec erreur ---');
    }
}
insertOneJob();
