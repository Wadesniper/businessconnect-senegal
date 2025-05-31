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
    title: "Chargé(e) de Communication et Marketing",
    company: "",
    location: "Sénégal",
    jobType: "Non précisé",
    sector: "Communication / Marketing / Relations Publiques",
    description: "Le candidat recherché doit posséder de solides compétences en communication, relations publiques et marketing. Il doit être capable de travailler de manière autonome, gérer son propre temps et être compétent dans l'utilisation des outils de travail nécessaires.",
    missions: [
        "Développer et mettre en œuvre des stratégies de communication et marketing",
        "Gérer les relations publiques et la visibilité de l'entreprise",
        "Créer et diffuser des contenus sur différents supports",
        "Assurer la gestion du temps et l'autonomie dans les missions"
    ],
    requirements: [
        "Solides compétences en communication et relations publiques",
        "Compétences en marketing",
        "Capacité à travailler de manière indépendante",
        "Maîtrise des outils de travail pertinents"
    ],
    contactEmail: "taphacisse157@gmail.com",
    contactPhone: "",
    keywords: [
        "communication",
        "relations publiques",
        "marketing",
        "travail autonome",
        "gestion du temps",
        "compétences",
        "recrutement"
    ]
};
console.log('--- Début du script d\'insertion Chargé Communication Marketing ---');
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
