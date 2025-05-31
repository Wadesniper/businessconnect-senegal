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
    title: "Agent Commercial",
    company: "",
    location: "Dakar, Sénégal",
    jobType: "Temps plein (non ouvert aux étudiants)",
    sector: "Commerce / Logistique / Transport international",
    description: "L'agent commercial est chargé de prospecter de nouveaux clients sur le terrain, conclure des commandes, proposer des solutions logistiques, notamment dans le domaine du transport international, et assurer le suivi des commandes. Il accompagne les clients dans tout le processus d'acquisition de marchandises depuis la Chine jusqu'à Dakar, avec professionnalisme et sécurité.",
    missions: [
        "Prospecter de nouveaux clients sur le terrain",
        "Conclure des commandes et proposer des solutions logistiques",
        "Assurer le suivi des commandes et accompagner les clients dans l'acquisition de marchandises depuis la Chine jusqu'à Dakar"
    ],
    requirements: [
        "Homme sénégalais, célibataire, âgé entre 25 et 30 ans",
        "Parle wolof",
        "Bonne connaissance des marchés locaux, de la culture et des boutiques",
        "Niveau Licence 3 (pas de Master)",
        "Minimum 1 an d'expérience en tant qu'agent commercial",
        "Disponible à temps plein (pas d'étudiant)"
    ],
    contactEmail: "sn25hollytrans@gmail.com",
    contactPhone: "",
    keywords: [
        "agent commercial",
        "prospection",
        "logistique",
        "transport international",
        "Chine",
        "Dakar",
        "wolof",
        "terrain",
        "licence 3",
        "commerce local",
        "temps plein"
    ]
};
console.log('--- Début du script d\'insertion Agent Commercial ---');
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
