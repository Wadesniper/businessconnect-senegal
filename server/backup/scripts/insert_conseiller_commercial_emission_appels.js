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
    title: "Conseiller Commercial en Émission d'Appels",
    company: "Exchange-Groupe",
    location: "Sénégal",
    jobType: "Temps plein",
    sector: "Centre d'appel / Téléphonie / Énergies / Vente",
    description: "Exchange-Groupe recrute des conseillers commerciaux expérimentés pour l'émission d'appels dans les secteurs de la téléphonie mobile et des énergies.",
    missions: [
        "Émettre des appels pour la prospection et la vente de services téléphonie mobile et énergies",
        "Assurer le suivi commercial et la satisfaction client",
        "Atteindre les objectifs de vente fixés par la direction"
    ],
    requirements: [
        "Expérience préalable dans un centre d'appel requise",
        "Bonne maîtrise de la communication commerciale par téléphone",
        "Connaissance des secteurs Téléphonie et Energies",
        "Aisance relationnelle, dynamisme, sens de l'écoute et de la persuasion"
    ],
    contactEmail: "recrutement@exchange-groupe.com",
    contactPhone: "",
    keywords: [
        "centre d'appel",
        "téléphonie",
        "énergies",
        "conseiller commercial",
        "émission d'appels",
        "call center",
        "vente",
        "télévente",
        "mobile"
    ]
};
console.log('--- Début du script d\'insertion Conseiller Commercial Émission d\'Appels ---');
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
