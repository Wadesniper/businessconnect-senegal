"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const User_1 = require("../models/User");
const jwt_config_1 = __importDefault(require("../config/jwt.config"));
// Liste des routes publiques qui ne nécessitent pas d'authentification
const PUBLIC_ROUTES = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/verify-email',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/marketplace/items', // Route publique pour voir les articles
    '/api/marketplace/search', // Route publique pour la recherche
];
const authenticate = async (req, res, next) => {
    try {
        // Vérifier si la route est publique
        const isPublicRoute = PUBLIC_ROUTES.some(route => req.path.startsWith(route));
        if (isPublicRoute) {
            return next();
        }
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'authentification manquant'
            });
        }
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token d\'authentification invalide'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwt_config_1.default.secret);
        // Vérifier si l'utilisateur existe toujours
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }
        // Ajouter les informations utilisateur complètes à la requête
        req.user = {
            id: user._id.toString(),
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            role: user.role || 'user',
            isVerified: user.isVerified || false
        };
        return next();
    }
    catch (error) {
        logger_1.logger.error('Erreur d\'authentification:', error);
        return res.status(401).json({
            success: false,
            message: 'Token invalide ou expiré'
        });
    }
};
exports.authenticate = authenticate;
const isAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Accès non autorisé. Droits administrateur requis.'
            });
        }
        return next();
    }
    catch (error) {
        logger_1.logger.error('Erreur de vérification admin:', error);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur'
        });
    }
};
exports.isAdmin = isAdmin;
