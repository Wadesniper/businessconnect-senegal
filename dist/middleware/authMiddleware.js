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
exports.authMiddleware = {
    authenticate: async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Accès non autorisé. Token manquant'
                });
            }
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
            const user = await User_1.User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            req.user = {
                id: user._id.toString(),
                email: user.email,
                role: user.role
            };
            next();
        }
        catch (error) {
            logger_1.logger.error('Erreur d\'authentification:', error);
            return res.status(401).json({
                success: false,
                message: 'Token invalide'
            });
        }
    },
    isAdmin: async (req, res, next) => {
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
                    message: 'Accès non autorisé. Privilèges administrateur requis'
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
    }
};
//# sourceMappingURL=authMiddleware.js.map