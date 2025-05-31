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
    title: "Cuisinier (Homme)",
    company: "Non précisé",
    location: "En ville, Dakar",
    jobType: "Temps plein (Du lundi au samedi)",
    sector: "Cuisine / Cuisinier / Plats européens / Organisation / Hygiène / Dakar",
    description: "Préparer quotidiennement le déjeuner et le dîner. Veiller à ce que le déjeuner soit prêt au plus tard à 13h00. Maintenir la cuisine propre et organisée. Gérer les provisions et assurer la qualité des ingrédients.",
    missions: [
        "Préparer quotidiennement le déjeuner et le dîner",
        "Veiller à ce que le déjeuner soit prêt au plus tard à 13h00",
        "Maintenir la cuisine propre et organisée",
        "Gérer les provisions et assurer la qualité des ingrédients"
    ],
    requirements: [
        "Homme avec expérience confirmée en cuisine familiale ou professionnelle",
        "Maîtrise des plats européens indispensable",
        "Sens de l'organisation, rigueur en hygiène et respect des horaires",
        "Sérieux, discret et professionnel"
    ],
    contactEmail: "rh@hybrideservices.com",
    contactPhone: "",
    keywords: [
        "cuisinier",
        "cuisine familiale",
        "cuisine professionnelle",
        "plats européens",
        "organisation",
        "hygiène",
        "Dakar"
    ]
};
console.log('--- Début du script d\'insertion Cuisinier (Homme) ---');
async function insertOneJob() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        console.log('Recherche d\'une offre existante...');
        const exists = await Job.findOne({ title: newJob.title, location: newJob.location, contactEmail: newJob.contactEmail });
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
