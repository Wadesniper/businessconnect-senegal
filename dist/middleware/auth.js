"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé - Token manquant'
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        const user = await User_1.User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé - Utilisateur non trouvé'
            });
        }
        req.user = {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role
        };
        next();
    }
    catch (error) {
        logger_1.logger.error('Erreur d\'authentification:', error);
        return res.status(401).json({
            success: false,
            message: 'Non autorisé - Token invalide'
        });
    }
};
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé - Utilisateur non connecté'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé - Rôle insuffisant'
            });
        }
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=auth.js.map