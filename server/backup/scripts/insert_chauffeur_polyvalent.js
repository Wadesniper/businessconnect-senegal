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
    title: "Chauffeur Polyvalent",
    company: "",
    location: "Dakar, Sénégal",
    jobType: "Temps plein",
    sector: "Transport / Logistique / Conduite",
    description: "Nous recherchons un chauffeur expérimenté capable de conduire différents types de véhicules et d'assurer des missions variées.",
    missions: [
        "Conduite de camions, voitures (boîte manuelle et automatique) et motos de vitesse (type Haojue)",
        "Réalisation d'inspections techniques et connaissances de base en réparation automobile",
        "Bonne connaissance des routes de Dakar et des villes environnantes"
    ],
    requirements: [
        "Minimum 3 ans d'expérience en conduite",
        "Âge compris entre 25 et 35 ans",
        "Bonne compréhension du français",
        "Sens des responsabilités, sérieux et fiable"
    ],
    contactEmail: "ccolmarsn.hr@gmail.com",
    contactPhone: "",
    keywords: [
        "chauffeur",
        "conduite",
        "moto",
        "camion",
        "Dakar",
        "boîte automatique",
        "Haojue",
        "inspection véhicule",
        "emploi transport"
    ]
};
console.log('--- Début du script d\'insertion Chauffeur Polyvalent ---');
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
