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
    title: "Télévendeur H/F",
    company: "humanex",
    location: "Télétravail",
    jobType: "Freelance",
    sector: "Centres d'appel / Hotline / Call center / Télévente",
    description: "Nous recrutons des Télévendeurs (H/F) dynamiques et motivés pour rejoindre notre équipe. Vous aurez pour mission de vendre des prestations de service auprès de prospects déjà qualifiés. Aucune prospection n'est requise : vous contactez uniquement des clients intéressés ou ayant déjà manifesté un besoin. Nombre de poste(s) : 75.",
    missions: [
        "Vendre des prestations de service auprès de prospects déjà qualifiés",
        "Contacter uniquement des clients intéressés ou ayant manifesté un besoin",
        "Assurer un excellent relationnel client au téléphone"
    ],
    requirements: [
        "Expérience en télévente ou en relation client appréciée",
        "Aisance téléphonique et excellent sens de la communication",
        "Persuasion, dynamisme et goût du challenge",
        "Français courant parlé, lu, écrit",
        "Posséder un ordinateur, un casque et une connexion Internet",
        "Disponible immédiatement"
    ],
    contactEmail: "contact@humanex.fr",
    contactPhone: "",
    keywords: [
        "télévente",
        "télétravail",
        "freelance",
        "relation client",
        "appel",
        "communication",
        "vente",
        "centre d'appel",
        "téléphone",
        "français"
    ]
};
console.log('--- Début du script d\'insertion Télévendeur H/F humanex ---');
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
