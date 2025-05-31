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
    title: "Recrutement Multi-Secteurs (plusieurs postes)",
    company: "SUNU MARCE",
    location: "Sénégal",
    jobType: "Temps plein",
    sector: "Multisectoriel / Commerce / Trading / Immobilier / RH / Communication / Finance / SAV / Logistique / Agriculture / Véhicules",
    description: "Dans le cadre de l'expansion de ses activités, SUNU MARCE recrute des profils qualifiés pour les secteurs suivants :\n1. Vente de matériels agricoles : Responsable Commercial Agricole, Responsable Logistique & Stock, Technicien Service Après-Vente (SAV)\n2. Trading entre le Sénégal et la Chine : Responsable Trading & Partenariats Internationaux, Chargé(e) des Importations & Douanes, Traducteur/Interprète (Mandarin-Français)\n3. Vente de véhicules : Responsable du Parc Automobile, Responsable Commercial Véhicules, Technicien / Contrôle Qualité\n4. Création de logements sociaux : Chef de Projet Immobilier, Responsable Financier Immobilier, Responsable Marketing Immobilier\n5. Fonctions transversales : DAF, RH, Juridique, Communication & Marketing, Informatique/SI.",
    missions: [
        "Assurer les missions liées au poste visé dans l'un des secteurs d'activité de SUNU MARCE",
        "Contribuer au développement et à la croissance de l'entreprise dans son secteur",
        "Travailler en équipe et en autonomie selon les besoins du poste"
    ],
    requirements: [
        "Formation en lien avec le poste visé",
        "Expérience significative dans un poste similaire",
        "Sens des responsabilités, autonomie, esprit d'équipe",
        "Connaissance du contexte sénégalais et/ou international appréciée"
    ],
    contactEmail: "sunumarce@gmail.com",
    contactPhone: "",
    keywords: [
        "emploi Sénégal",
        "recrutement multisectoriel",
        "commerce",
        "trading",
        "immobilier",
        "RH",
        "communication",
        "finance",
        "SAV",
        "logistique",
        "Mandarin",
        "véhicules",
        "agriculture",
        "SUNU MARCE"
    ]
};
console.log('--- Début du script d\'insertion Recrutement Multi-Secteurs SUNU MARCE ---');
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
