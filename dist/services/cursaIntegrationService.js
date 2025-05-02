"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursaIntegrationService = void 0;
const axios_1 = __importDefault(require("axios"));
const formation_1 = require("../models/formation");
const User_1 = require("../models/User");
const appError_1 = require("../utils/appError");
class CursaIntegrationService {
    constructor() {
        this.cursaApiUrl = process.env.CURSA_API_URL || 'https://api.cursa.app';
        this.apiKey = process.env.CURSA_API_KEY || '';
    }
    async syncCursaFormations() {
        try {
            const response = await axios_1.default.get(`${this.cursaApiUrl}/courses`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            const cursaFormations = response.data;
            for (const cursaFormation of cursaFormations) {
                await formation_1.Formation.findOneAndUpdate({ cursaUrl: cursaFormation.url }, {
                    title: cursaFormation.title,
                    description: cursaFormation.description,
                    category: this.mapCursaCategory(cursaFormation.category),
                    level: this.mapCursaLevel(cursaFormation.level),
                    duration: cursaFormation.duration,
                    price: cursaFormation.price,
                    thumbnail: cursaFormation.thumbnail,
                    isExternalCourse: true,
                    cursaUrl: cursaFormation.url
                }, { upsert: true, new: true });
            }
        }
        catch (error) {
            throw new appError_1.AppError('Erreur lors de la synchronisation avec Cursa.app', 500);
        }
    }
    async validateUserAccess(userId, formationId) {
        try {
            const user = await User_1.User.findById(userId);
            const formation = await formation_1.Formation.findById(formationId);
            if (!user || !formation) {
                throw new appError_1.AppError('Utilisateur ou formation non trouvé', 404);
            }
            const hasActiveSubscription = await this.checkUserSubscription(userId);
            if (!hasActiveSubscription) {
                return false;
            }
            return true;
        }
        catch (error) {
            throw new appError_1.AppError('Erreur lors de la vérification de l\'accès', 500);
        }
    }
    async getFormationRedirectUrl(formationId) {
        try {
            const formation = await formation_1.Formation.findById(formationId);
            if (!formation) {
                throw new appError_1.AppError('Formation non trouvée', 404);
            }
            return formation.cursaUrl;
        }
        catch (error) {
            throw new appError_1.AppError('Erreur lors de la récupération de l\'URL de redirection', 500);
        }
    }
    async checkUserSubscription(userId) {
        return true;
    }
    mapCursaCategory(cursaCategory) {
        const categoryMap = {
            'development': 'développement',
            'business': 'business',
            'marketing': 'marketing',
            'design': 'design',
            'languages': 'langues',
            'soft-skills': 'soft-skills'
        };
        return categoryMap[cursaCategory] || 'autres';
    }
    mapCursaLevel(cursaLevel) {
        const levelMap = {
            'beginner': 'débutant',
            'intermediate': 'intermédiaire',
            'advanced': 'avancé'
        };
        return levelMap[cursaLevel] || 'débutant';
    }
}
exports.cursaIntegrationService = new CursaIntegrationService();
//# sourceMappingURL=cursaIntegrationService.js.map