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
    title: "Décorateur / Monteur de Bâche",
    company: "",
    location: "Dakar, Sénégal",
    jobType: "CDI ou CDD (à préciser)",
    sector: "Décoration / Montage de bâches / Événementiel / Affichage / Installation",
    description: "Dans le cadre de nos activités, nous recherchons un décorateur et monteur de bâche ayant une solide expérience dans le domaine. Le candidat devra être capable de réaliser des installations de bâches et des travaux de décoration pour divers événements ou supports publicitaires.",
    missions: [],
    requirements: [
        "Expérience avérée dans la décoration et le montage de bâches",
        "Bonne condition physique et sens du détail",
        "Ponctualité, autonomie et rigueur",
        "Capacité à travailler en équipe et sous pression"
    ],
    contactEmail: "",
    contactPhone: "+221 77 747 75 72",
    keywords: [
        "décoration",
        "montage de bâches",
        "événementiel",
        "affichage",
        "Dakar",
        "installation",
        "expérience",
        "recrutement"
    ]
};
console.log('--- Début du script d\'insertion Décorateur / Monteur de Bâche Dakar ---');
async function insertOneJob() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        console.log('Recherche d\'une offre existante...');
        const exists = await Job.findOne({ title: newJob.title, contactPhone: newJob.contactPhone });
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
