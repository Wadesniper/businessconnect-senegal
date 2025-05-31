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
    title: "Technicien(ne) de surface (02 postes)",
    company: "",
    location: "Ferme située à Noto, Sénégal",
    jobType: "Temps plein, poste à pourvoir avant la Tabaski",
    sector: "Nettoyage / Hygiène / Entretien / Ferme / Sénégal",
    description: "Nous recrutons deux (02) technicien(ne)s de surface pour l'entretien de notre ferme à Noto. Les candidat(e)s retenu(e)s devront assurer la propreté des locaux et espaces de travail dans le respect des normes d'hygiène.",
    missions: [
        "Assurer la propreté des locaux et espaces de travail",
        "Respecter les normes d'hygiène en vigueur"
    ],
    requirements: [
        "Expérience exigée dans un poste similaire",
        "Disponibilité immédiate",
        "Ponctualité, rigueur, sens de l'hygiène"
    ],
    contactEmail: "andre.sagna1@gmail.com",
    contactPhone: "78 798 85 54 / 78 111 35 35",
    keywords: [
        "technicien de surface",
        "nettoyage",
        "hygiène",
        "ferme",
        "Noto",
        "Tabaski",
        "entretien",
        "Sénégal"
    ]
};
console.log('--- Début du script d\'insertion Technicien(ne) de surface Noto ---');
async function insertOneJob() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        console.log('Recherche d\'une offre existante...');
        const exists = await Job.findOne({ title: newJob.title, contactPhone: newJob.contactPhone });
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
