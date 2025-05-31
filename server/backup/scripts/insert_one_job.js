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
// Remplis ici les champs de la nouvelle offre à insérer
const newJob = {
    title: 'Assistante Administratif(ve) et Financier(ere)',
    company: '',
    location: 'Dakar, Senegal',
    jobType: 'CDD ou Stage (selon le profil)',
    sector: 'Finance',
    description: 'Nous recherchons un(e) Assistante Administratif(ve) et Financier(ere) ayant une solide base en gestion pour rejoindre notre equipe.',
    missions: [
        'Gestion administrative et financiere',
        'Suivi comptable',
        'Appui a la direction',
        'Taches administratives courantes'
    ],
    requirements: [
        'Formation : Bac +2/3 en gestion, comptabilite, finance ou equivalent',
        'Experience : 1 a 2 ans',
        'Disponibilite immediate'
    ],
    contactEmail: 'job.recrut7@gmail.com',
    contactPhone: '',
    keywords: ['assistant administratif', 'assistant financier', 'comptabilite', 'gestion', 'finance', 'stage', 'CDD', 'Dakar']
};
async function insertOneJob() {
    try {
        await mongoose_1.default.connect(MONGODB_URI, { dbName: 'businessconnect' });
        console.log('Connecté à MongoDB');
        // Vérification d'unicité sur le titre + contactEmail
        const exists = await Job.findOne({ title: newJob.title, contactEmail: newJob.contactEmail });
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
        // process.exit(1); // On commente pour voir l'erreur complète
    }
}
insertOneJob();
