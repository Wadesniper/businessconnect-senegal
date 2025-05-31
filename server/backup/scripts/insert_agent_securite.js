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
    title: "Agent de sécurité",
    company: "Xess Sécurité",
    location: "Bargny, Rufisque",
    jobType: "Temps plein",
    sector: "Sécurité / Protection / Surveillance / Recrutement / Bargny / Rufisque",
    description: "Xess Sécurité recrute des agents de sécurité pour des missions dans les zones de Bargny et Rufisque. Les candidats devront être en bonne condition physique et capables d'assurer la sécurité des biens et des personnes.",
    missions: [
        "Assurer la sécurité des biens et des personnes sur le site attribué",
        "Surveiller les accès et effectuer des rondes régulières",
        "Signaler tout incident ou comportement suspect",
        "Intervenir en cas de besoin selon les procédures de sécurité",
        "Collaborer avec l'équipe et rendre compte à la hiérarchie"
    ],
    requirements: [
        "Âge requis : entre 21 et 56 ans",
        "Aucune exigence de diplôme",
        "Bonne condition physique",
        "Savoir lire, écrire et parler français",
        "Être de nationalité sénégalaise"
    ],
    contactEmail: "recrutement@swift2s.com",
    contactPhone: "78 142 36 16",
    keywords: [
        "sécurité",
        "agent de sécurité",
        "sans diplôme",
        "Bargny",
        "Rufisque",
        "recrutement",
        "physique apte",
        "casier judiciaire",
        "sénégalais",
        "français",
        "certificat médical"
    ]
};
console.log('--- Début du script d\'insertion Agent de sécurité ---');
async function insertOneJob() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        console.log('Recherche d\'une offre existante...');
        const exists = await Job.findOne({ title: newJob.title, company: newJob.company, location: newJob.location });
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
