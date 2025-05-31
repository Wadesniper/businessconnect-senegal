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
    title: "Stagiaire Ingénieur(e) Civil(e)",
    company: "Kanergy Sénégal",
    location: "Sénégal",
    jobType: "Stage (3 mois)",
    sector: "Génie Civil / Construction",
    description: "Kanergy Sénégal recrute un(e) stagiaire pour son département Génie Civil.",
    missions: [
        "Élaboration de devis techniques",
        "Réalisation de devis estimatifs (évaluation des coûts globaux)",
        "Production de devis quantitatifs (quantités détaillées + prix unitaires)",
        "Utilisation d'outils de métré (Excel, AutoCAD, etc.)",
        "Conception de plans d'exécution",
        "Participation à la production de plans d'exécution détaillés",
        "Intégration des cotes techniques et nomenclatures matériaux",
        "Vérification de la cohérence plans/devis",
        "Analyse des cahiers des charges",
        "Suivi des coûts et quantités sur chantier"
    ],
    requirements: [
        "Formation : Bac+3/4 en Génie Civil",
        "Maîtrise des logiciels (AutoCAD, Excel)",
        "Connaissances en normes de construction",
        "Rigueur dans l'analyse quantitative",
        "Autonomie et sens de l'organisation"
    ],
    contactEmail: "rh@knrgy.com",
    contactPhone: "",
    keywords: [
        "stage",
        "ingénieur civil",
        "génie civil",
        "devis",
        "AutoCAD",
        "Excel",
        "construction"
    ]
};
async function insertOneJob() {
    try {
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        const exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
        if (exists) {
            console.log('Offre déjà existante, aucune insertion.');
        }
        else {
            const result = await Job.create(newJob);
            console.log('Offre insérée :', result);
        }
        await mongoose_1.default.disconnect();
        console.log('Déconnexion MongoDB');
    }
    catch (err) {
        console.error('Erreur lors de l\'insertion :', err);
        if (err instanceof Error) {
            console.error('Stack:', err.stack);
        }
    }
}
insertOneJob();
