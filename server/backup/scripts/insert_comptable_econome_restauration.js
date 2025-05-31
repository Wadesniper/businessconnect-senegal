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
    title: "Comptable / Économe",
    company: "",
    location: "",
    jobType: "Temps plein",
    sector: "Comptabilité / Économat / Gestion de stock / Restauration rapide / Achat / Fournisseurs",
    description: "Une association spécialisée dans la restauration rapide recherche un(e) comptable / économe expérimenté(e) dans le secteur. Le/la candidat(e) aura pour mission principale de veiller à l'approvisionnement des produits utilisés dans les fast-foods de l'association, en assurant une gestion rigoureuse des stocks et une bonne relation avec les fournisseurs.",
    missions: [
        "Gérer les stocks de manière optimale",
        "Prendre en charge les commandes et la réception des marchandises",
        "Négocier avec les fournisseurs pour garantir le meilleur rapport qualité/prix",
        "Suivre les mouvements de stock et anticiper les besoins",
        "Assurer la comptabilité liée aux achats et à la gestion des flux"
    ],
    requirements: [
        "Expérience confirmée en comptabilité, économat et gestion de stocks",
        "Connaissance du secteur de la restauration rapide",
        "Capacité à gérer plusieurs points de vente et à travailler en autonomie"
    ],
    contactEmail: "arthurbougerollebonapp@gmail.com",
    contactPhone: "",
    keywords: [
        "comptable",
        "économe",
        "gestion de stock",
        "restauration rapide",
        "économat",
        "achat",
        "fournisseurs",
        "fast-food",
        "comptabilité"
    ]
};
console.log('--- Début du script d\'insertion Comptable / Économe Restauration ---');
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
