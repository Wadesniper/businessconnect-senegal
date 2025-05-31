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
    title: "Responsable Production – Aliment de Bétail",
    company: "SN2I Sénégal",
    location: "Sénégal",
    jobType: "Temps plein",
    sector: "Agro-industrie / Production / Bétail",
    description: "Le Responsable de Production est chargé de la production d'aliment de bétail, du bon déroulement de la fabrication, de l'entretien des outils de production, de la définition et du respect des formules de fabrication. Il assure également l'interface entre les différentes étapes du processus, la gestion des ressources et le suivi complet de la production.",
    missions: [
        "Superviser la production d'aliment de bétail",
        "Veiller au bon déroulement de la fabrication",
        "Assurer l'entretien des outils de production",
        "Définir et respecter les formules de fabrication",
        "Gérer les ressources et suivre la production",
        "Assurer l'interface entre les différentes étapes du processus"
    ],
    requirements: [
        "Formation : Bac+4 en Agronomie ou Techniques de Production d'une grande école",
        "Expérience : Minimum 3 ans dans le domaine de la production d'aliment de bétail",
        "Bonne connaissance des produits et des contraintes de fabrication",
        "Maîtrise des procédés (dosage, broyage, granulation…)",
        "Maîtrise des logiciels bureautiques et de gestion commerciale",
        "Gestion des stocks et des coûts",
        "Bonne maîtrise du français",
        "Leadership, rigueur, sens de l'organisation",
        "Capacité à déléguer, à manager une équipe, à travailler sous pression",
        "Réactivité et capacité à résoudre rapidement les problèmes",
        "Orientation vers l'optimisation des coûts et de la productivité"
    ],
    contactEmail: "rh@sn2isenegal.com",
    contactPhone: "+221 77 698 70 46",
    keywords: [
        "production",
        "bétail",
        "agro-industrie",
        "gestion",
        "fabrication",
        "technicien",
        "responsable",
        "Sénégal",
        "agronomie"
    ]
};
console.log('--- Début du script d\'insertion Responsable Production Bétail ---');
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
