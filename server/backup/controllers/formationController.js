"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationController = void 0;
// Déclaration locale de CURSA_FORMATIONS
const CURSA_FORMATIONS = {
    informatique: {
        url: 'https://cursa.app/cours-online-linformatique-gratuits',
        categories: ['Programmation web', 'IA', 'Bases de données', 'Développement mobile', 'Cybersécurité']
    },
    langues: {
        url: 'https://cursa.app/cours-online-langues-et-communication-gratuits',
        categories: ['Anglais', 'Espagnol', 'Français', 'Chinois', 'Japonais']
    },
    gestion: {
        url: 'https://cursa.app/cours-online-gestion-et-affaires-gratuits',
        categories: ['Marketing', 'Finance', 'Entrepreneuriat', 'Management', 'Comptabilité']
    },
    pro: {
        url: 'https://cursa.app/cours-online-professionnaliser-gratuits',
        categories: ['Immobilier', 'Automobile', 'Sécurité', 'Construction', 'Services']
    },
    art: {
        url: 'https://cursa.app/cours-online-art-et-design-gratuits',
        categories: ['Graphisme', 'UX/UI', '3D', 'Animation', 'Vidéo']
    },
    education: {
        url: 'https://cursa.app/cours-online-education-de-base-gratuits',
        categories: ['Mathématiques', 'Sciences', 'Histoire', 'Philosophie', 'Littérature']
    },
    esthetique: {
        url: 'https://cursa.app/cours-online-esthetique-gratuits',
        categories: ['Maquillage', 'Soins', 'Coiffure']
    },
    sante: {
        url: 'https://cursa.app/cours-online-sante-gratuits',
        categories: ['Soins', 'Nutrition', 'Psychologie', 'Premiers secours']
    }
};
class FormationController {
    constructor() {
        // Obtenir toutes les formations externes (Cursa)
        this.getCursaFormations = async (req, res) => {
            try {
                const { category } = req.query;
                let formations = CURSA_FORMATIONS;
                if (category) {
                    formations = Object.fromEntries(Object.entries(CURSA_FORMATIONS).filter(([_, data]) => data.categories.includes(category)));
                }
                res.json({
                    success: true,
                    data: formations
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la récupération des formations'
                });
            }
        };
        // Obtenir toutes les catégories de formations
        this.getCategories = async (_, res) => {
            try {
                const categories = new Set();
                Object.values(CURSA_FORMATIONS).forEach((data) => {
                    data.categories.forEach((cat) => categories.add(cat));
                });
                res.json({
                    success: true,
                    data: Array.from(categories).sort()
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la récupération des catégories'
                });
            }
        };
    }
}
exports.FormationController = FormationController;
