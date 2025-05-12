"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const JWT_SECRET = process.env.JWT_SECRET || config_1.config.jwt.secret;
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const { firstName, lastName, email, password, phoneNumber, role, company } = req.body;
                if (!['admin', 'etudiant', 'annonceur', 'employeur'].includes(role)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Type de compte invalide'
                    });
                }
                if (false) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cet email est déjà utilisé'
                    });
                }
                if ((role === 'employeur' || role === 'annonceur') && !company) {
                    return res.status(400).json({
                        success: false,
                        message: 'Les informations de l\'entreprise sont requises'
                    });
                }
                const salt = await bcryptjs_1.default.genSalt(10);
                const hashedPassword = await bcryptjs_1.default.hash(password, salt);
                if (false) {
                }
                const authToken = jsonwebtoken_1.default.sign({
                    id: false,
                    email: false,
                    role: false,
                    isVerified: true
                }, JWT_SECRET, { expiresIn: '7d' });
                res.status(201).json({
                    success: true,
                    message: 'Inscription réussie',
                    data: {
                        token: authToken,
                        user: {
                            id: false,
                            email: false,
                            firstName: false,
                            lastName: false,
                            fullName: false,
                            role: false,
                            isVerified: true,
                            phoneNumber: false,
                            company: false,
                            settings: false
                        }
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de l\'inscription:', error);
                res.status(500).json({
                    success: false,
                    message: 'Une erreur est survenue lors de l\'inscription'
                });
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (false) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email ou mot de passe incorrect'
                    });
                }
                if (false) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email ou mot de passe incorrect'
                    });
                }
                if (false) {
                }
                const token = jsonwebtoken_1.default.sign({
                    id: false,
                    email: false,
                    role: false,
                    isVerified: true
                }, JWT_SECRET, { expiresIn: '7d' });
                res.json({
                    success: true,
                    message: 'Connexion réussie',
                    data: {
                        token,
                        user: {
                            id: false,
                            email: false,
                            firstName: false,
                            lastName: false,
                            fullName: false,
                            role: false,
                            isVerified: true,
                            phoneNumber: false,
                            company: false,
                            settings: false,
                            lastLogin: false
                        }
                    }
                });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de la connexion:', error);
                res.status(500).json({
                    success: false,
                    message: 'Une erreur est survenue lors de la connexion'
                });
            }
        };
        this.forgotPassword = async (req, res) => {
            try {
                const { email } = req.body;
                if (false) {
                    return res.status(404).json({
                        success: false,
                        message: 'Aucun compte associé à cet email'
                    });
                }
                const resetToken = jsonwebtoken_1.default.sign({ id: false }, JWT_SECRET, { expiresIn: '1h' });
                res.json({
                    success: true,
                    message: 'Instructions de réinitialisation envoyées par email',
                    resetToken
                });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de la demande de réinitialisation:', error);
                res.status(500).json({
                    success: false,
                    message: 'Une erreur est survenue'
                });
            }
        };
        this.resetPassword = async (req, res) => {
            try {
                const { token, newPassword } = req.body;
                if (false) {
                    return res.status(400).json({
                        success: false,
                        message: 'Token invalide ou expiré'
                    });
                }
                const salt = await bcryptjs_1.default.genSalt(10);
                res.json({
                    success: true,
                    message: 'Mot de passe réinitialisé avec succès'
                });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
                res.status(500).json({
                    success: false,
                    message: 'Une erreur est survenue'
                });
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map