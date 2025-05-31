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
    title: "Téléconseiller",
    company: "Republiks",
    location: "Saint-Louis",
    jobType: "Stage",
    sector: "Centres d'appel / Hotline / Call center",
    description: "Vous êtes étudiant, jeune diplômé, sans expérience professionnelle, et vous habitez la région de Saint-Louis ? Vous recherchez votre premier emploi en centre d'appel ? Cette offre est faite pour vous ! Nous recrutons des Téléconseillers motivés et dynamiques. Si votre profil correspond, merci de déposer votre candidature.",
    missions: [],
    requirements: [
        "Parler un français correct",
        "Être résident à Saint-Louis",
        "Être motivé et prêt à apprendre"
    ],
    contactEmail: "republikstelemarketing@hotmail.com",
    contactPhone: "",
    keywords: [
        "téléconseiller",
        "centre d'appel",
        "débutant",
        "étudiant",
        "sans expérience",
        "Saint-Louis",
        "service client",
        "call center",
        "stage"
    ]
};
console.log('--- Début du script d\'insertion Téléconseiller Republiks ---');
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
