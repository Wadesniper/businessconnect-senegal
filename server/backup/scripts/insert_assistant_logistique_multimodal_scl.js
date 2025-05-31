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
    title: "Assistant(e) Logistique Multimodal (Import/Export)",
    company: "Société de Cultures Légumières (SCL)",
    location: "Sénégal",
    jobType: "Temps plein",
    sector: "Logistique / Transport multimodal / Import / Export / Commerce international / SCL",
    description: "La Société de Cultures Légumières (SCL), leader dans la production et l'exportation de cultures maraîchères, recherche un(e) Assistant(e) Logistique Multimodal (Import/Export) expérimenté(e). Vous assurerez la gestion et l'optimisation des flux de transport multimodal (routier, maritime, aérien) dans le respect des normes et règlementations internationales.",
    missions: [
        "Coordonner et superviser les activités de transport multimodal",
        "Garantir une circulation fluide et conforme des marchandises",
        "Suivre les livraisons et gérer les imprévus",
        "Élaborer des rapports d'activité et des KPI",
        "Superviser la conformité des documents de transport et bancaires",
        "Planifier et synchroniser les opérations en anticipant les retards"
    ],
    requirements: [
        "Bac +3/5 en logistique, transport ou commerce international",
        "Minimum 2 ans d'expérience en gestion du transport multimodal",
        "Maîtrise des incoterms et procédures douanières",
        "Rigueur, réactivité, sens de l'analyse et esprit d'équipe"
    ],
    contactEmail: "recrutement@scl.sn",
    contactPhone: "",
    keywords: [
        "logistique",
        "transport multimodal",
        "import",
        "export",
        "SCL",
        "incoterms",
        "douane",
        "KPI",
        "emploi logistique Sénégal"
    ]
};
console.log('--- Début du script d\'insertion Assistant(e) Logistique Multimodal SCL ---');
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
