"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
// Liste des routes publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/marketplace/items',
    '/api/marketplace/search',
];
class AuthMiddleware {
    constructor() {
        this.authenticate = async (req, res, next) => {
            try {
                // Vérifier si la route est publique
                const isPublicRoute = PUBLIC_ROUTES.some(route => req.path.startsWith(route));
                if (isPublicRoute) {
                    return next();
                }
                const token = req.headers.authorization?.split(' ')[1];
                if (!token) {
                    return res.status(401).json({
                        success: false,
                        message: 'Token d\'authentification manquant'
                    });
                }
                const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
                const user = await User_1.User.findById(decoded.id);
                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Utilisateur non trouvé'
                    });
                }
                req.user = user;
                next();
            }
            catch (error) {
                logger_1.logger.error('Erreur d\'authentification:', error);
                return res.status(401).json({
                    success: false,
                    message: 'Token invalide ou expiré'
                });
            }
        };
        this.isAdmin = async (req, res, next) => {
            try {
                if (!req.user || req.user.role !== 'admin') {
                    return res.status(403).json({
                        success: false,
                        message: 'Accès non autorisé'
                    });
                }
                next();
            }
            catch (error) {
                logger_1.logger.error('Erreur de vérification admin:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Erreur serveur'
                });
            }
        };
    }
}
exports.authMiddleware = new AuthMiddleware();
//# sourceMappingURL=authMiddleware.js.map