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
    title: "Enquêteur / Enquêtrice",
    company: "Non précisé",
    location: "Non précisé (mobilité possible pour terrain)",
    jobType: "Mission d'un mois",
    sector: "Enquête / Terrain / Communication / Relation client / Autonomie",
    description: "Mener des enquêtes durant une campagne d'un mois. Assurer une communication orale efficace, notamment téléphonique. Organiser son travail de manière autonome. Respecter les horaires fixés et se déplacer si nécessaire.",
    missions: [
        "Mener des enquêtes durant une campagne d'un mois",
        "Assurer une communication orale efficace, notamment téléphonique",
        "Organiser son travail de manière autonome",
        "Respecter les horaires fixés et se déplacer si nécessaire"
    ],
    requirements: [
        "Bonne présentation et excellent relationnel",
        "Aisance en communication orale",
        "Organisé(e), autonome et sérieux(se)",
        "Expérience en enquêtes appréciée, débutants acceptés",
        "Disponibilité et mobilité pour terrain"
    ],
    contactEmail: "dkconsulting4@gmail.com",
    contactPhone: "",
    keywords: [
        "enquête",
        "communication",
        "terrain",
        "relation client",
        "autonomie"
    ]
};
console.log('--- Début du script d\'insertion Enquêteur / Enquêtrice ---');
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
