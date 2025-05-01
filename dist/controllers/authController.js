"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const notificationService_1 = require("../services/notificationService");
const logger_1 = require("../utils/logger");
const errors_1 = require("../utils/errors");
exports.authController = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Un utilisateur avec cet email existe déjà'
                });
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            const user = new User_1.User({
                name,
                email,
                password: hashedPassword
            });
            await user.save();
            const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.config.JWT_SECRET, { expiresIn: '24h' });
            res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'inscription:', error);
            throw new errors_1.AppError('Erreur lors de l\'inscription', 500);
        }
    },
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id }, config_1.config.JWT_SECRET, { expiresIn: config_1.config.JWT_EXPIRES_IN });
            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la connexion:', error);
            throw new errors_1.AppError('Erreur lors de la connexion', 500);
        }
    },
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            const user = await User_1.User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Aucun compte associé à cet email'
                });
            }
            const resetToken = jsonwebtoken_1.default.sign({ id: user._id }, config_1.config.JWT_SECRET, { expiresIn: '1h' });
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpire = new Date(Date.now() + 3600000);
            await user.save();
            const notificationService = new notificationService_1.NotificationService();
            await notificationService.sendPasswordResetEmail(email, resetToken);
            res.status(200).json({
                success: true,
                message: 'Email de réinitialisation envoyé'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la demande de réinitialisation:', error);
            throw new errors_1.AppError('Erreur lors de la demande de réinitialisation', 500);
        }
    },
    async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const decoded = jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
            const user = await User_1.User.findOne({
                _id: decoded.id,
                resetPasswordToken: token,
                resetPasswordExpire: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Token invalide ou expiré'
                });
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(password, salt);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.status(200).json({
                success: true,
                message: 'Mot de passe réinitialisé avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
            throw new errors_1.AppError('Token invalide ou expiré', 400);
        }
    },
    async getProfile(req, res) {
        var _a;
        try {
            const user = await User_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération du profil:', error);
            throw new errors_1.AppError('Erreur lors de la récupération du profil', 500);
        }
    },
    async updateProfile(req, res) {
        var _a;
        try {
            const user = await User_1.User.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, { $set: req.body }, { new: true, runValidators: true });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du profil:', error);
            throw new errors_1.AppError('Erreur lors de la mise à jour du profil', 500);
        }
    },
    async updatePassword(req, res) {
        var _a;
        try {
            const user = await User_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select('+password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            const { currentPassword, newPassword } = req.body;
            const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Mot de passe actuel incorrect'
                });
            }
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
            user.password = hashedPassword;
            await user.save();
            res.status(200).json({
                success: true,
                message: 'Mot de passe mis à jour avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du mot de passe:', error);
            throw new errors_1.AppError('Erreur lors de la mise à jour du mot de passe', 500);
        }
    },
    async deleteAccount(req, res) {
        var _a;
        try {
            const user = await User_1.User.findByIdAndDelete((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Compte supprimé avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression du compte:', error);
            throw new errors_1.AppError('Erreur lors de la suppression du compte', 500);
        }
    },
    async getAllUsers(req, res) {
        try {
            const users = await User_1.User.find().select('-password');
            res.status(200).json({
                success: true,
                users
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des utilisateurs:', error);
            throw new errors_1.AppError('Erreur lors de la récupération des utilisateurs', 500);
        }
    },
    async updateUser(req, res) {
        try {
            const user = await User_1.User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.status(200).json({
                success: true,
                user
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            throw new errors_1.AppError('Erreur lors de la mise à jour de l\'utilisateur', 500);
        }
    },
    async deleteUser(req, res) {
        try {
            const user = await User_1.User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.status(200).json({
                success: true,
                message: 'Utilisateur supprimé avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression de l\'utilisateur:', error);
            throw new errors_1.AppError('Erreur lors de la suppression de l\'utilisateur', 500);
        }
    }
};
//# sourceMappingURL=authController.js.map