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
    title: "Vendeur(se) Boutique – Linge de lit haut de gamme",
    company: "",
    location: "Dakar",
    jobType: "CDI",
    sector: "Vente / Boutique / Linge de maison",
    description: "Nous recherchons un(e) vendeur(se) dynamique et passionné(e) pour gérer notre boutique spécialisée dans la vente de linge de lit haut de gamme. Vous serez en charge de l'accueil de la clientèle, de la mise en valeur des produits et de la concrétisation des ventes.",
    missions: [
        "Accueillir chaleureusement les clients",
        "Présenter les produits de manière attractive",
        "Conseiller la clientèle et conclure les ventes",
        "Veiller à la bonne tenue de la boutique"
    ],
    requirements: [
        "Excellente présentation et sens du contact",
        "Passion pour la décoration intérieure et le linge de maison",
        "Dynamisme, autonomie et sens de l'organisation",
        "Expérience dans la vente souhaitée"
    ],
    contactEmail: "",
    contactPhone: "+221 77 407 20 40",
    keywords: [
        "vendeur",
        "boutique",
        "linge de lit",
        "haut de gamme",
        "vente",
        "accueil client",
        "Dakar",
        "emploi boutique"
    ]
};
async function insertOneJob() {
    try {
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        const exists = await Job.findOne({ title: newJob.title, contactPhone: newJob.contactPhone });
        if (exists) {
            console.log('Offre déjà existante, aucune insertion.');
        }
        else {
            const result = await Job.create(newJob);
            console.log('Offre insérée :', result);
        }
        await mongoose_1.default.disconnect();
        console.log('Déconnexion MongoDB');
    }
    catch (err) {
        console.error('Erreur lors de l\'insertion :', err);
        if (err instanceof Error) {
            console.error('Stack:', err.stack);
        }
    }
}
insertOneJob();
