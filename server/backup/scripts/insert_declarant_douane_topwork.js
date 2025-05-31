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
    title: "Déclarant en douane (02 postes)",
    company: "Cabinet de recrutement pour un client dans le secteur du transit",
    location: "Sénégal",
    jobType: "Temps plein",
    sector: "Transit / Dédouanement / Logistique / Import-Export / Douane",
    description: "Dans le cadre des activités de transit d'un de ses clients, le cabinet recrute deux déclarants en douane. Les candidats auront pour principales missions : préparer et soumettre les déclarations douanières, constituer les dossiers de dédouanement, assurer le suivi des documents et la relation avec les clients.",
    missions: [
        "Préparer et soumettre les déclarations douanières",
        "Constituer les dossiers de dédouanement",
        "Assurer le suivi des documents et la relation avec les clients"
    ],
    requirements: [
        "Bonne connaissance du Code des Douanes sénégalais",
        "Maîtrise des outils douaniers",
        "Sens de l'organisation",
        "Expérience en préparation de déclarations douanières",
        "Expérience dans la constitution et le suivi de dossiers de dédouanement",
        "Bon relationnel pour la communication avec les clients"
    ],
    contactEmail: "cv@topwork.sn",
    contactPhone: "",
    keywords: [
        "déclarant en douane",
        "transit",
        "dédouanement",
        "Code des Douanes",
        "outils douaniers",
        "logistique",
        "import-export",
        "Sénégal"
    ]
};
console.log('--- Début du script d\'insertion Déclarant en douane Topwork ---');
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
