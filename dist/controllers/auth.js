"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const User_1 = require("../models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const emailService_1 = require("../services/emailService");
const logger_1 = require("../utils/logger");
exports.authController = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, phoneNumber, password } = req.body;
            // Validation des champs requis
            if (!firstName || !lastName || !phoneNumber || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Veuillez remplir tous les champs obligatoires'
                });
            }
            // Vérifier si l'utilisateur existe déjà
            const existingUser = await User_1.User.findOne({
                $or: [
                    { email: email?.toLowerCase() },
                    { phoneNumber }
                ]
            });
            if (existingUser) {
                const field = existingUser.phoneNumber === phoneNumber ? 'téléphone' : 'email';
                return res.status(400).json({
                    success: false,
                    message: `Un utilisateur avec cet ${field} existe déjà`
                });
            }
            // Hasher le mot de passe
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            // Créer le nouvel utilisateur
            const user = await User_1.User.create({
                firstName,
                lastName,
                email: email?.toLowerCase(),
                phoneNumber,
                password: hashedPassword,
                role: 'etudiant'
            });
            // Générer le token JWT
            const token = jsonwebtoken_1.default.sign({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }, config_1.config.JWT_SECRET, { expiresIn: config_1.config.JWT_EXPIRES_IN });
            // Si un email est fourni, envoyer l'email de vérification
            if (email) {
                try {
                    await (0, emailService_1.sendVerificationEmail)(email, user._id.toString());
                }
                catch (error) {
                    logger_1.logger.error('Erreur lors de l\'envoi de l\'email de vérification:', error);
                }
            }
            res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'inscription:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de l\'inscription'
            });
        }
    },
    login: async (req, res) => {
        try {
            const { email, phoneNumber, password } = req.body;
            if (!password || (!email && !phoneNumber)) {
                return res.status(400).json({
                    success: false,
                    message: 'Veuillez fournir un email ou un numéro de téléphone et un mot de passe'
                });
            }
            // Trouver l'utilisateur par email ou téléphone
            const user = await User_1.User.findOne({
                $or: [
                    { email: email?.toLowerCase() },
                    { phoneNumber }
                ]
            });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }
            // Vérifier le mot de passe
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Identifiants incorrects'
                });
            }
            // Générer le token JWT
            const token = jsonwebtoken_1.default.sign({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role
            }, config_1.config.JWT_SECRET, { expiresIn: config_1.config.JWT_EXPIRES_IN });
            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    role: user.role,
                    isVerified: user.isVerified
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la connexion:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la connexion'
            });
        }
    }
};
//# sourceMappingURL=auth.js.map