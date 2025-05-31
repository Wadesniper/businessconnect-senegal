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
    title: "Agent de Nettoyage Professionnel / Traditionnel",
    company: "",
    location: "Rufisque, Keur Massar, Diamniadio, Sandiara, Thiès, Tivaouane, Nguérigne, Saly, Mbour, autres (à préciser)",
    jobType: "Temps plein ou temps partiel",
    sector: "Nettoyage / Entretien / Service à domicile / Recrutement local",
    description: "Nous recrutons des agents de nettoyage dynamiques et motivé(e)s pour renforcer notre équipe. Que vous soyez disponible à plein temps ou à temps partiel, vous pouvez rejoindre notre réseau et percevoir un revenu en fonction de votre disponibilité et de votre implication.",
    missions: [],
    requirements: [
        "Résider dans l'une des localités citées (ou préciser votre localité)",
        "Être jeune, sérieux(se), motivé(e) et dynamique",
        "Avoir de l'expérience ou des compétences en nettoyage professionnel ou traditionnel",
        "Être discipliné(e), respectueux(se), rigoureux(se), débrouillard(e) et méthodique"
    ],
    contactEmail: "agrecrutement2025@gmail.com",
    contactPhone: "+221 78 587 14 14",
    keywords: [
        "nettoyage",
        "agent d'entretien",
        "temps partiel",
        "temps plein",
        "ménage",
        "recrutement local",
        "service à domicile",
        "Rufisque",
        "Keur Massar",
        "Thiès",
        "Mbour",
        "Diamniadio",
        "Saly"
    ]
};
console.log('--- Début du script d\'insertion Agent de Nettoyage Professionnel / Traditionnel ---');
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
