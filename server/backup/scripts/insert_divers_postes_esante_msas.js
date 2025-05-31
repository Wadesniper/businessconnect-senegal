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
    title: "Divers postes projet e-Santé (Architecte d'entreprise, Expert e-Santé, etc.)",
    company: "Ministère de la Santé et de l'Action Sociale (MSAS)",
    location: "Sénégal (télétravail et/ou sur site selon poste)",
    jobType: "Temps plein",
    sector: "Santé / e-Santé / Conseil / IT",
    description: "Recrutement de consultants individuels pour différents postes dans le cadre du projet e-Santé. Contrats à durée déterminée avec rémunération mensuelle fixe pour la majorité des postes. Pour l'architecte d'entreprise et l'expert e-santé, le contrat sera de type prestation de services au temps passé. Cette formule pourra également s'appliquer à d'autres experts, selon les besoins. Date limite de dépôt des candidatures : mercredi 14 mai 2025 à 17h précises.",
    missions: [
        "Participer au projet e-Santé du MSAS selon le poste occupé (ex : architecte d'entreprise, expert e-santé, etc.)",
        "Contribuer à la transformation digitale du secteur santé au Sénégal",
        "Assurer la réalisation des missions confiées selon le cahier des charges du poste"
    ],
    requirements: [
        "Copies légalisées (Police ou Gendarmerie) des diplômes et attestations",
        "Curriculum Vitae mentionnant au moins trois personnes références",
        "Lettre de motivation"
    ],
    contactEmail: "recrutement@paens.gouv.sn",
    contactPhone: "",
    keywords: [
        "e-santé",
        "consultant",
        "architecte d'entreprise",
        "expert e-santé",
        "MSAS",
        "projet santé",
        "Sénégal",
        "recrutement",
        "télétravail",
        "CDD",
        "transformation digitale"
    ]
};
console.log('--- Début du script d\'insertion Divers Postes e-Santé MSAS ---');
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
