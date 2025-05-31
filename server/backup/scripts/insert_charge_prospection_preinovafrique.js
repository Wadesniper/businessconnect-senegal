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
    title: "Chargé de Prospection",
    company: "",
    location: "Dakar",
    jobType: "CDD - Freelance",
    sector: "Commercial / Prospection / Marketing / Vente",
    description: "Nous sommes à la recherche de Chargés de Prospection. Le Chargé de Prospection joue un rôle clé dans le développement commercial de l'entreprise, en identifiant de nouvelles opportunités de marché et en attirant des clients potentiels. Il intervient principalement sur le terrain pour prospecter, établir des contacts et promouvoir les produits ou services de l'entreprise auprès de prospects qualifiés.",
    missions: [
        "Identifier de nouvelles opportunités de marché",
        "Prospecter sur le terrain et établir des contacts",
        "Promouvoir les produits ou services de l'entreprise auprès de prospects qualifiés"
    ],
    requirements: [
        "Diplôme en commerce, marketing ou dans un domaine équivalent",
        "Expérience souhaitée en prospection commerciale ou vente terrain",
        "Bonne connaissance du secteur d'activité de l'entreprise et de ses produits/services"
    ],
    contactEmail: "info@preinovafrique.com",
    contactPhone: "+221 78 714 51 51",
    keywords: [
        "prospection",
        "commercial",
        "terrain",
        "marketing",
        "communication",
        "vente",
        "Dakar",
        "CDD",
        "freelance"
    ]
};
console.log('--- Début du script d\'insertion Chargé de Prospection Preinovafrique ---');
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
