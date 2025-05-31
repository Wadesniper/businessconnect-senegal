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
    title: "Vendeur / Vendeuse en Pharmacie",
    company: "",
    location: "Dakar, Centre-ville",
    jobType: "Temps plein",
    sector: "Pharmacie / Vente / Santé",
    description: "Une pharmacie située au centre-ville recherche des vendeurs motivés pour rejoindre son équipe.",
    missions: [
        "Accueillir et conseiller les clients de la pharmacie",
        "Assurer la vente de produits pharmaceutiques et parapharmaceutiques",
        "Participer à la gestion des stocks et à la mise en rayon"
    ],
    requirements: [
        "Fournir un CV",
        "Fournir une lettre de motivation manuscrite",
        "Fournir une photo d'identité"
    ],
    contactEmail: "pharmarecrute53@gmail.com",
    contactPhone: "",
    keywords: [
        "pharmacie",
        "vente",
        "vendeur",
        "vendeuse",
        "santé",
        "centre-ville",
        "recrutement",
        "lettre manuscrite",
        "emploi pharmacie"
    ]
};
console.log('--- Début du script d\'insertion Vendeur/Vendeuse en Pharmacie ---');
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
