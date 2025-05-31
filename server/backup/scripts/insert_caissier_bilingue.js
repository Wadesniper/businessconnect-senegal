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
    title: "Caissier Bilingue",
    company: "",
    location: "Sénégal",
    jobType: "Temps plein",
    sector: "Caisse / Service / Bilingue",
    description: "Nous recherchons un caissier ou une caissière bilingue (français/anglais) pour intégrer notre équipe.",
    missions: [
        "Assurer l'encaissement des clients",
        "Communiquer efficacement en français et en anglais",
        "Garantir un service de qualité et un bon relationnel"
    ],
    requirements: [
        "Maîtrise du français et de l'anglais (oral et écrit)",
        "Expérience en tant que caissier(ère) est un atout",
        "Sérieux(se), rigoureux(se), ponctuel(le)",
        "Bon relationnel et sens du service"
    ],
    contactEmail: "aminatarh9@gmail.com",
    contactPhone: "",
    keywords: [
        "caissier",
        "bilingue",
        "emploi",
        "anglais",
        "français",
        "recrutement",
        "caisse"
    ]
};
console.log('--- Début du script d\'insertion Caissier Bilingue ---');
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
