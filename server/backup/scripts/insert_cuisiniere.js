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
    title: "Cuisinière",
    company: "Non précisé",
    location: "Non précisé",
    jobType: "Non précisé",
    sector: "Cuisine / Restauration / HACCP / Hygiène / Créativité / Préparation",
    description: "Élaborer et préparer les plats selon les directives du chef. Assurer une cuisson parfaite et une présentation soignée. Participer à la gestion des stocks et commandes. Respecter les normes d'hygiène HACCP et maintenir un espace propre. Proposer des idées pour enrichir les menus. Travailler en collaboration avec l'équipe cuisine et service.",
    missions: [
        "Élaborer et préparer les plats selon les directives du chef",
        "Assurer une cuisson parfaite et une présentation soignée",
        "Participer à la gestion des stocks et commandes",
        "Respecter les normes d'hygiène HACCP et maintenir un espace propre",
        "Proposer des idées pour enrichir les menus",
        "Travailler en collaboration avec l'équipe cuisine et service"
    ],
    requirements: [
        "Minimum 2 ans d'expérience en cuisine, idéalement en restaurant, hôtel ou traiteur",
        "CAP/BEP cuisine ou équivalent est un plus",
        "Maîtrise des techniques de base (taillage, cuisson, dressage)",
        "Connaissance des règles d'hygiène et sécurité alimentaire",
        "Capacité à gérer plusieurs préparations sous pression",
        "Rigueur, organisation, propreté",
        "Travail en équipe et bonne communication",
        "Passion et créativité culinaire"
    ],
    contactEmail: "eliterhrecrutement@gmail.com",
    contactPhone: "",
    keywords: [
        "cuisine",
        "cuisinière",
        "HACCP",
        "restauration",
        "préparation",
        "hygiène",
        "créativité"
    ]
};
console.log('--- Début du script d\'insertion Cuisinière ---');
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
