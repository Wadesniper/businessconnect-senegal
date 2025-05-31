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
    title: "Responsable Marketing",
    company: "Katos Consulting",
    location: "Point E, Dakar, Sénégal",
    jobType: "Temps plein",
    sector: "Marketing / Immobilier / Communication",
    description: "Katos Consulting, société immobilière basée au Point E, recherche un Responsable Marketing pour développer sa stratégie de communication et renforcer sa présence sur le marché immobilier.",
    missions: [
        "Développer et mettre en œuvre la stratégie marketing de l'entreprise",
        "Renforcer la présence de la société sur le marché immobilier",
        "Gérer la communication digitale et les outils marketing",
        "Analyser les performances et proposer des axes d'amélioration"
    ],
    requirements: [
        "Formation en marketing ou domaine équivalent",
        "Expérience de 3 à 5 ans en marketing, idéalement dans le secteur immobilier",
        "Maîtrise des outils digitaux : Word, Excel, et autres logiciels pertinents"
    ],
    contactEmail: "katosconsulting@gmail.com",
    contactPhone: "",
    keywords: [
        "marketing",
        "immobilier",
        "stratégie de communication",
        "outils digitaux",
        "Dakar",
        "marketing digital",
        "responsable marketing"
    ]
};
console.log('--- Début du script d\'insertion Responsable Marketing Katos ---');
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
