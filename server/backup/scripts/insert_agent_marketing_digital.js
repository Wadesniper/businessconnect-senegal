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
    title: "Agent Marketing Digital",
    company: "Master Office",
    location: "Sénégal",
    jobType: "Temps plein",
    sector: "Marketing / Communication / Digital",
    description: "Master Office recrute un Agent Marketing Digital pour promouvoir l'image de l'entreprise à travers des actions ciblées et créatives.",
    missions: [
        "Promouvoir l'image de l'entreprise sur les réseaux sociaux et supports digitaux",
        "Créer des contenus visuels attractifs",
        "Mettre en place des campagnes marketing digitales",
        "Analyser les retombées des actions marketing"
    ],
    requirements: [
        "Niveau : Bac +3 en Marketing Digital",
        "Maîtrise de Photoshop",
        "Créativité, autonomie et capacité à mettre en valeur la marque de l'entreprise"
    ],
    contactEmail: "recrutement@masteroffice.sn",
    contactPhone: "",
    keywords: [
        "marketing digital",
        "Photoshop",
        "communication",
        "image de marque",
        "création visuelle",
        "Bac+3"
    ]
};
console.log('--- Début du script d\'insertion Agent Marketing Digital ---');
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
