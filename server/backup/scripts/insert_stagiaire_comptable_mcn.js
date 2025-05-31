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
    title: "Stagiaire Comptable",
    company: "Musée des Civilisations Noires (MCN)",
    location: "Dakar",
    jobType: "Stage",
    sector: "Comptabilité / Finance / Musée / Formation",
    description: "Dans le but de participer à la formation et à l'employabilité des jeunes dans les institutions culturelles, en général, et muséales, en particulier, le Musée des Civilisations Noires (MCN) recrute un stagiaire dans le domaine de la comptabilité. Le stage débutera en mai et prendra fin en juillet 2025. La durée totale est de 3 mois.",
    missions: [
        "Participer aux activités comptables du MCN",
        "Découvrir le fonctionnement d'une institution culturelle et muséale",
        "Contribuer à la formation et à l'employabilité des jeunes dans le secteur culturel"
    ],
    requirements: [
        "Bac +3 ou Bac +4 en finance/comptabilité"
    ],
    contactEmail: "rh@mcn.sn",
    contactPhone: "",
    keywords: [
        "stage",
        "comptabilité",
        "finance",
        "musée",
        "Dakar",
        "jeune diplômé",
        "formation professionnelle"
    ]
};
console.log('--- Début du script d\'insertion Stagiaire Comptable MCN ---');
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
