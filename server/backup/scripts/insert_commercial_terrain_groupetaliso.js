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
    title: "Commercial Terrain",
    company: "GroupeTaliso",
    location: "Dakar",
    jobType: "Stage",
    sector: "Banque / Assurance / Finances / Vente",
    description: "Nous sommes à la recherche de Commerciaux Terrain. Missions : prospection, vente de contrats d'assurance, fidélisation, reporting, participation à des actions commerciales, etc. Poste nécessitant autonomie, sens relationnel et capacité de persuasion.",
    missions: [
        "Développer et gérer un portefeuille clients (prospection, analyse des besoins, proposition de solutions)",
        "Négocier et vendre des contrats d'assurance (santé, prévoyance, auto, habitation, etc.)",
        "Fidéliser et accompagner les clients (conseil, ajustement des contrats)",
        "Optimiser la visibilité de l'offre (actions commerciales, événements, promotions)",
        "Assurer le reporting et la veille concurrentielle"
    ],
    requirements: [
        "Niveau minimum : Bac",
        "Expérience souhaitée en vente ou prospection, idéalement en assurance, banque ou services financiers",
        "Aisance relationnelle et sens du contact",
        "Maîtrise des techniques de vente et de négociation",
        "Autonomie, bonne organisation, esprit d'initiative",
        "Une première expérience en relation client est un plus, mais non indispensable"
    ],
    contactEmail: "gestion@groupetaliso.com",
    contactPhone: "",
    keywords: [
        "commercial terrain",
        "assurance",
        "vente",
        "prospection",
        "relation client",
        "négociation",
        "stage",
        "Dakar"
    ]
};
console.log('--- Début du script d\'insertion Commercial Terrain GroupeTaliso ---');
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
