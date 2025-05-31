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
    title: "Agent de comptoir",
    company: "Agence de voyage et de tourisme IATA",
    location: "Parcelles Assainies, Dakar, Sénégal",
    jobType: "Temps plein",
    sector: "Voyage / Tourisme / Billetterie / Réservation",
    description: "Une agence de voyage et de tourisme IATA recherche un agent de comptoir (H/F) qualifié pour la vente de billets d'avion et la gestion de réservations sur les plateformes Amadeus et Galileo. Le poste requiert dynamisme, disponibilité et réactivité.",
    missions: [
        "Vendre des billets d'avion et gérer les réservations sur Amadeus et Galileo",
        "Émettre, modifier, annuler et rembourser des billets sur Amadeus et Galileo",
        "Accueillir et conseiller la clientèle au comptoir",
        "Utiliser les outils bureautiques et les réseaux sociaux pour la gestion des dossiers"
    ],
    requirements: [
        "Maîtrise du wolof et du français",
        "Maîtrise des plateformes Amadeus (obligatoire, avec 2 ans minimum d'expérience) et Galileo",
        "Expérience obligatoire de 2 ans minimum avec Amadeus pour la vente de billets d'avion",
        "Compétence dans l'émission, le changement, l'annulation et le remboursement de billets sur Amadeus et Galileo",
        "Bonne maîtrise des outils bureautiques de base (Word, Excel) et des réseaux sociaux",
        "Dynamisme, disponibilité et sens de l'écoute",
        "Niveau de base en anglais (atout)"
    ],
    contactEmail: "",
    contactPhone: "+221 77 396 20 99",
    keywords: [
        "agent de comptoir",
        "Amadeus",
        "Galileo",
        "réservation",
        "billets d'avion",
        "voyage",
        "tourisme",
        "Parcelles Assainies",
        "Dakar",
        "wolof",
        "bureautique"
    ]
};
console.log('--- Début du script d\'insertion Agent de comptoir Agence de voyage ---');
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
