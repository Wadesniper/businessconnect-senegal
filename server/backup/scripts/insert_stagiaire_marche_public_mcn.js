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
    title: "Stagiaire en Marché Public (x2)",
    company: "Musée des Civilisations Noires (MCN)",
    location: "Dakar, Sénégal",
    jobType: "Stage",
    sector: "Marché public / Culture / Musée / Formation",
    description: "Dans le cadre de sa mission de formation et de contribution à l'employabilité des jeunes dans les institutions culturelles, le Musée des Civilisations Noires (MCN) recherche deux (02) stagiaires pour son service de passation des marchés.\nPériodes de stage : Stagiaire 1 : Juin à Août 2025 ; Stagiaire 2 : Septembre à Novembre 2025. Durée : 3 mois chacun.",
    missions: [
        "Participer aux activités du service de passation des marchés du MCN",
        "Découvrir le fonctionnement d'une institution culturelle et muséale",
        "Contribuer à la formation et à l'employabilité des jeunes dans le secteur culturel"
    ],
    requirements: [
        "Être titulaire d'un Bac +3 ou Bac +4 en gestion de passation des marchés",
        "Avoir un intérêt pour les institutions culturelles et muséales"
    ],
    contactEmail: "rh@mcn.sn",
    contactPhone: "",
    keywords: [
        "stage",
        "marché public",
        "passation des marchés",
        "musée",
        "culture",
        "employabilité",
        "jeunes",
        "MCN",
        "Dakar"
    ]
};
console.log('--- Début du script d\'insertion Stagiaire Marché Public MCN ---');
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
