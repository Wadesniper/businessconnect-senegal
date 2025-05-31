"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../../../.env' });
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
    keywords: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const Job = mongoose_1.default.model('Job', JobSchema);
const MONGODB_URI = "mongodb+srv://businessconnect:tlIQzehUEZnFPwoa@cluster0.gtehtk.mongodb.net/businessconnect?retryWrites=true&w=majority";
const jobs = [
    {
        title: 'Commerciaux tricycles',
        company: '',
        location: 'Sénégal',
        jobType: 'Temps plein',
        sector: '',
        description: "Vente de produits ou services à l'aide d'un tricycle",
        missions: [],
        requirements: [
            'Permis de conduire obligatoire',
            'Expérience dans la vente'
        ],
        contactEmail: 'elyismailasy@gmail.com',
        keywords: [
            'commercial',
            'tricycle',
            'permis de conduire',
            'vente',
            'expérience',
            'mobilité'
        ],
        isActive: true
    },
    {
        title: 'Livreur moto',
        company: '',
        location: 'Médina, Fass, Dakar-Plateau',
        jobType: 'Temps plein',
        sector: '',
        description: "Livraison en moto dans les zones de Médina, Fass et Dakar-Plateau. Moto fournie par l'entreprise.",
        missions: [],
        requirements: [
            'Avoir un permis moto valide'
        ],
        contactEmail: '+221 77 574 67 33',
        keywords: [
            'livreur',
            'moto',
            'permis moto',
            'livraison',
            'Dakar',
            'Médina',
            'Fass',
            'Dakar-Plateau',
            'emploi terrain'
        ],
        isActive: true
    },
    {
        title: 'Agent de maintenance fibre optique',
        company: '',
        location: 'Dakar',
        jobType: 'Temps plein',
        sector: '',
        description: "Assurer le support sur les activités de maintenance curative fibre optique dans la région de Dakar. Tenir des reportings réguliers sur les activités quotidiennes et hebdomadaires. Analyser tous les dérangements traités à J-1 (causes, actions préventives...). Contrôler les interventions et traiter les volumes mensuels des sous-traitants. Participer aux réunions internes et externes. Apporter un support aux collaborateurs sur les cas complexes. Sauvegarder et mettre à jour les bases de données. Entretenir et maintenir les appareils et outils d'intervention. Coordonner les tâches sur le terrain et avec les différents acteurs internes/externes. Exploiter les résultats de maintenance pour améliorer la qualité des interventions. Participer à la correction des écarts constatés. Participer aux ATP des boîtes désorganisées. Contribuer à la mise en œuvre des exigences QSE.",
        missions: [],
        requirements: [
            "Connaissance de l'architecture des réseaux télécoms",
            "Connaissance des réseaux d'accès cuivre et fibre",
            "Connaissance de l'architecture FTTH",
            "Capacité à rédiger des rapports synthétiques"
        ],
        contactEmail: 'recrutement@globalbusiness-gbg.com',
        keywords: [
            'maintenance',
            'fibre optique',
            'télécom',
            'FTTH',
            'réseaux',
            'Dakar',
            'support technique',
            'QSE',
            'reporting',
            'sous-traitance'
        ],
        isActive: true
    },
    {
        title: 'Mareyeur(se)',
        company: '',
        location: 'Sénégal',
        jobType: 'Temps plein',
        sector: '',
        description: "Négocier de grandes quantités de poisson frais avec les pêcheurs. Acheter des produits issus de la mer, vérifier leur traçabilité et attester de leur qualité et conformité. Respecter les conditions d'hygiène et veiller au respect de la chaîne du froid. Réaliser diverses opérations : tri, tranchage, filetage, transformation, conditionnement, étiquetage, emballage.",
        missions: [],
        requirements: [
            "Connaissance des produits de la mer, des techniques de transformation et des circuits de distribution",
            "Aisance relationnelle",
            "Organisation, disponibilité, réactivité",
            "Rigueur et ponctualité"
        ],
        contactEmail: 'adama.dailycatch@gmail.com',
        keywords: [
            'mareyeur',
            'produits de la mer',
            'transformation',
            'hygiène',
            'chaîne du froid',
            'poisson',
            'tri',
            'filetage',
            'distribution'
        ],
        isActive: true
    },
    {
        title: "Téléconseiller débutant (formation gratuite)",
        company: '',
        location: 'Sénégal',
        jobType: "Formation suivie d'un emploi garanti",
        sector: '',
        description: "Formation gratuite destinée aux personnes sans expérience en centre d'appel. Emploi garanti à l'issue de la formation.",
        missions: [],
        requirements: [
            "Bien s'exprimer en français"
        ],
        contactEmail: 'primeoenergie1234@gmail.com',
        keywords: [
            "téléconseiller",
            "centre d'appel",
            "formation gratuite",
            "débutant",
            "emploi garanti",
            "français"
        ],
        isActive: true
    },
    {
        title: "Caissier(e)",
        company: '',
        location: 'Sénégal',
        jobType: 'Temps plein',
        sector: '',
        description: "Gérer les opérations de caisse pour le compte d'une entreprise.",
        missions: [],
        requirements: [],
        contactEmail: 'WhatsApp : +221 77 177 21 16',
        keywords: [
            'caissier',
            'caisse',
            'recrutement',
            'entreprise',
            'finance',
            'accueil'
        ],
        isActive: true
    },
    {
        title: "Assistante comptable",
        company: '',
        location: 'Sénégal',
        jobType: 'Temps plein',
        sector: '',
        description: "Saisie et classement des documents comptables. Tenue à jour de la comptabilité. Vérification de l'exhaustivité des pièces justificatives liées aux dépenses. Établissement des chèques et ordres de virement. Tenue des rapprochements bancaires mensuels. Gestion des entrées locatives (saisie des locataires, contrôle des dossiers). Gestion de la caisse. Paiement des déclarations fiscales mensuelles. Élaboration des tableaux de suivi clients mensuellement. Participation à l'analyse des comptes et aux travaux de fin d'exercice. Suivi des échéances et relances téléphoniques.",
        missions: [],
        requirements: [
            "Licence en Comptabilité",
            "Maîtrise du logiciel comptable Sage Saari",
            "Très bon niveau en français",
            "Autonomie et sens des responsabilités"
        ],
        contactEmail: 'WhatsApp : +221 77 284 78 78',
        keywords: [
            'comptabilité',
            'assistante comptable',
            'Sage Saari',
            'gestion financière',
            'relance',
            'trésorerie',
            'analyse',
            'fiscalité',
            'locataires'
        ],
        isActive: true
    }
];
async function insertJobs() {
    try {
        await mongoose_1.default.connect(MONGODB_URI, {
            dbName: 'businessconnect',
        });
        console.log('Connecté à MongoDB');
        const result = await Job.insertMany(jobs);
        console.log('Offres insérées :', result);
        await mongoose_1.default.disconnect();
        console.log('Déconnexion MongoDB');
    }
    catch (err) {
        console.error('Erreur lors de l\'insertion :', err);
        process.exit(1);
    }
}
insertJobs();
