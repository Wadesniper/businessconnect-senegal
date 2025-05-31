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
    title: "Stagiaire Commercial",
    company: "KALIA",
    location: "Dakar, Sénégal",
    jobType: "Stage",
    sector: "Commercial / Marketing / Immobilier",
    description: "Dans le cadre de ses activités, KALIA recrute des commerciaux stagiaires. Le stagiaire sera impliqué dans les activités commerciales de l'entreprise et contribuera à la prospection, la prise de rendez-vous et la gestion client.",
    missions: [
        "Prospection de nouveaux clients",
        "Prise de rendez-vous",
        "Gestion et suivi de la relation client",
        "Participation aux activités commerciales de l'entreprise"
    ],
    requirements: [
        "Minimum Bac +3 ou diplôme d'école supérieure en gestion, commerce, marketing/communication ou gestion immobilière",
        "Expérience de 2 ans dans un domaine similaire",
        "Maîtrise parfaite de la langue française",
        "Tenace, dynamique, bon sens de l'écoute",
        "Expérience significative dans la prise de rendez-vous",
        "Capacité d'adaptation et réactivité",
        "Compétences en analyse et synthèse",
        "Goût du challenge et esprit de compétition"
    ],
    contactEmail: "residenceskalia2023@gmail.com",
    contactPhone: "",
    keywords: [
        "stage",
        "commercial",
        "marketing",
        "gestion immobilière",
        "communication",
        "prospection",
        "Dakar",
        "prise de rendez-vous",
        "Bac+3"
    ]
};
console.log('--- Début du script d\'insertion Stagiaire Commercial KALIA ---');
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
