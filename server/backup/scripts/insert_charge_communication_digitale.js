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
    title: "Chargé(e) de Communication digitale",
    company: "Grande École de Droit, Dakar",
    location: "Dakar, Sénégal",
    jobType: "Non précisé",
    sector: "Communication digitale / Marketing digital / Réseaux sociaux / SEO / Contenu numérique / Enseignement supérieur / Dakar",
    description: "La Grande École de Droit recherche un(e) Chargé(e) de Communication digitale pour définir et mettre en œuvre la stratégie digitale, gérer les contenus numériques (textes, visuels, vidéos, podcasts), animer les réseaux sociaux, gérer le site web (mise à jour, SEO, ergonomie), suivre les performances via des outils d'analyse, assurer une veille numérique, collaborer avec des prestataires externes et participer à des projets transversaux.",
    missions: [
        "Définir et mettre en œuvre la stratégie de communication digitale",
        "Gérer et créer des contenus numériques (textes, visuels, vidéos, podcasts)",
        "Animer et développer la présence sur les réseaux sociaux",
        "Gérer le site web (mise à jour, SEO, ergonomie)",
        "Suivre les performances via des outils d'analyse (Google Analytics, Hootsuite, etc.)",
        "Assurer une veille numérique et suivre les tendances du secteur",
        "Collaborer avec des prestataires externes (agences, freelances, etc.)",
        "Participer à des projets transversaux de l'établissement"
    ],
    requirements: [
        "Bac +3 à Bac +5 en communication, marketing digital, journalisme ou multimédia",
        "Première expérience souhaitée (stage, alternance ou emploi) dans un poste similaire",
        "Excellente maîtrise de la communication écrite et visuelle",
        "Bonne connaissance des réseaux sociaux et des codes du web",
        "Maîtrise des CMS (WordPress, Joomla), logiciels de création (Canva, Photoshop, Illustrator), outils d'emailing (Mailchimp, Sendinblue) et outils d'analyse (Google Analytics, Hootsuite)",
        "Connaissances en SEO / SEA et marketing digital",
        "Sens de l'organisation, dynamisme, autonomie, créativité et esprit d'équipe"
    ],
    contactEmail: "candidature@profil.sn",
    contactPhone: "",
    keywords: [
        "communication digitale",
        "marketing digital",
        "réseaux sociaux",
        "SEO",
        "contenu numérique",
        "WordPress",
        "Google Analytics",
        "communication écrite",
        "créativité",
        "Dakar"
    ]
};
console.log('--- Début du script d\'insertion Chargé(e) de Communication digitale ---');
async function insertOneJob() {
    try {
        console.log('Connexion à MongoDB...');
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        console.log('Recherche d\'une offre existante...');
        const exists = await Job.findOne({ title: newJob.title, company: newJob.company, location: newJob.location });
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
