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
    title: "Assistante Stagiaire",
    company: "",
    location: "Keur Massar, Sénégal",
    jobType: "Stage",
    sector: "Assistanat / Administration / Digital / CRM",
    description: "Nous recrutons une Assistante Stagiaire dynamique et motivée pour rejoindre notre équipe. La candidate assistera l'équipe dans la gestion administrative, la gestion de la base de données clients via un CRM, et pourra contribuer à la communication digitale de l'entreprise. Indemnité de transport mensuelle. Début du stage : Dès que possible.",
    missions: [
        "Assister l'équipe dans la gestion administrative",
        "Gérer la base de données clients via un CRM",
        "Contribuer à la communication digitale de l'entreprise"
    ],
    requirements: [
        "Femme résidant à Keur Massar ou environs",
        "À l'aise avec les outils digitaux",
        "Maîtrise du Pack Office (Word, Excel, PowerPoint)",
        "Notions de CRM (atout)",
        "Organisée, rigoureuse, proactive",
        "Bonne expression écrite et orale"
    ],
    contactEmail: "khadidiatou.f@hybrideservices.com",
    contactPhone: "",
    keywords: [
        "assistante",
        "stage",
        "Keur Massar",
        "CRM",
        "bureautique",
        "digitale",
        "administrative",
        "transport"
    ]
};
console.log('--- Début du script d\'insertion Assistante Stagiaire Keur Massar ---');
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
