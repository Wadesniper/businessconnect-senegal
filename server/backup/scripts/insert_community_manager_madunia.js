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
    title: "Community Manager Freelance (Beauté & Bien-être)",
    company: "Madunia Cosmétiques",
    location: "Télétravail",
    jobType: "Freelance",
    sector: "Beauté / Bien-être / Digital / Réseaux sociaux",
    description: "Notre marque de produits cosmétiques naturels dédiée aux cheveux texturés est en pleine croissance. Nous recherchons un(e) community manager freelance spécialisé(e) dans l'univers de la beauté naturelle et du bien-être.",
    missions: [
        "Créer du contenu engageant (posts, visuels, Reels, stories)",
        "Gérer notre page Instagram (publication, interaction, animation)",
        "Développer une stratégie de contenu (calendrier éditorial, ligne éditoriale, hashtags)",
        "Augmenter l'engagement de la communauté et booster nos ventes"
    ],
    requirements: [
        "Expérience confirmée en gestion de compte Instagram (portfolio apprécié)",
        "Très bonne connaissance du secteur beauté / cosmétique",
        "Sens de l'esthétique, créativité et autonomie",
        "Maîtrise de Canva, CapCut, Meta Business, Photoshop, etc.",
        "Orthographe et syntaxe impeccables"
    ],
    contactEmail: "elise.ayissi@gmail.com",
    contactPhone: "",
    keywords: [
        "community manager",
        "freelance",
        "beauté naturelle",
        "Instagram",
        "cosmétique",
        "contenu digital",
        "Canva",
        "CapCut",
        "branding",
        "storytelling",
        "télétravail",
        "réseaux sociaux",
        "Reels",
        "marketing digital"
    ]
};
console.log('--- Début du script d\'insertion Community Manager Madunia ---');
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
