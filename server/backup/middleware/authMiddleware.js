"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const authMiddleware = async (req, res, next) => {
    try {
        // Vérifier le header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Accès non autorisé. Token manquant'
            });
            return;
        }
        // Extraire et vérifier le token
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        // Vérifier l'utilisateur
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
            return;
        }
        // Vérifier si l'utilisateur est vérifié
        if (!user.isVerified) {
            res.status(401).json({
                success: false,
                message: 'Veuillez vérifier votre email'
            });
            return;
        }
        // Ajouter l'utilisateur à la requête
        req.user = {
            id: user._id.toString(),
            email: user.email || '',
            role: user.role
        };
        next();
        return;
    }
    catch (error) {
        logger_1.logger.error('Erreur d\'authentification:', error);
        res.status(401).json({
            success: false,
            message: 'Token invalide'
        });
        return;
    }
};
exports.authMiddleware = authMiddleware;
const isAdmin = async (req, res, next) => {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
            res.status(403).json({ message: 'Accès refusé' });
            return;
        }
        next();
        return;
    }
    catch (error) {
        logger_1.logger.error('Erreur de vérification admin:', error);
        res.status(500).json({ message: 'Erreur serveur' });
        return;
    }
};
exports.isAdmin = isAdmin;
