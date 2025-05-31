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
    title: "Développeur Odoo (Réf : SR_DO_NC2025)",
    company: "Votre Assistant Virtuel (recrutement pour un client en France)",
    location: "Télétravail (home office)",
    jobType: "Temps partiel",
    sector: "Odoo / ERP / Développement / Maintenance / API / Télétravail / France",
    description: "Nous recherchons pour l'un de nos clients en France un(e) Développeur Odoo. Votre mission principale consistera à paramétrer, maintenir et faire évoluer l'ERP Odoo de notre client. Vous devrez gérer tous les modules de l'ERP et, à moyen terme, accompagner la migration vers Odoo SH, notamment pour l'intégration d'API clients.",
    missions: [
        "Paramétrer, maintenir et faire évoluer l'ERP Odoo du client",
        "Gérer tous les modules de l'ERP",
        "Accompagner la migration vers Odoo SH",
        "Intégrer des API clients"
    ],
    requirements: [
        "Bac +5 en Développement Web (idéalement)",
        "Minimum 3 ans d'expérience sur Odoo",
        "Solide expertise en paramétrage et maintenance d'Odoo",
        "Très bon niveau de français à l'oral et à l'écrit",
        "Bon niveau d'anglais requis (communication client)",
        "Connexion internet stable avec un back-up obligatoire",
        "Matériel informatique performant avec solution de secours en cas de coupure",
        "Disponibilité immédiate pour un engagement de 3h/jour minimum"
    ],
    contactEmail: "recrutement@votreassistantvirtuel.com",
    contactPhone: "",
    keywords: [
        "Odoo",
        "développeur",
        "ERP",
        "télétravail",
        "maintenance",
        "paramétrage",
        "API",
        "Odoo SH",
        "France",
        "freelance",
        "part-time"
    ]
};
console.log('--- Début du script d\'insertion Développeur Odoo (Réf : SR_DO_NC2025) VAV France ---');
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
