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
    title: "Commercial terrain",
    company: "Non précisée",
    location: "Thies, Kaolack, Diourbel, Tamba (Sénégal)",
    jobType: "Non précisé",
    sector: "Commercial / Vente / Prospection / Terrain / Régions Sénégal",
    description: "Prospecter et vendre sur le terrain dans les zones attribuées. Développer la clientèle locale dans les régions de Thies, Kaolack, Diourbel et Tamba.",
    missions: [
        "Prospecter et vendre sur le terrain dans les zones attribuées",
        "Développer la clientèle locale dans les régions de Thies, Kaolack, Diourbel et Tamba"
    ],
    requirements: [
        "Profil commercial avec dynamisme et sens du terrain (détails non précisés)"
    ],
    contactEmail: "medipartfatoumata@gmail.com",
    contactPhone: "",
    keywords: [
        "commercial terrain",
        "vente",
        "prospection",
        "Thies",
        "Kaolack",
        "Diourbel",
        "Tamba"
    ]
};
console.log('--- Début du script d\'insertion Commercial terrain ---');
async function insertOneJob() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        console.log('Recherche d\'une offre existante...');
        const exists = await Job.findOne({ title: newJob.title, location: newJob.location, contactEmail: newJob.contactEmail });
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
