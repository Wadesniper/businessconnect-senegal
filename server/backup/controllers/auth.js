"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const email_1 = require("../utils/email");
const logger_1 = require("../utils/logger");
const jwt_config_1 = __importDefault(require("../config/jwt.config"));
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Un utilisateur avec cet email existe déjà'
            });
        }
        // Hasher le mot de passe
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Créer le token de vérification
        const verificationToken = jsonwebtoken_1.default.sign({ email }, jwt_config_1.default.verificationSecret, { expiresIn: '24h' });
        // Créer l'utilisateur
        const user = await User_1.User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationToken,
            role: 'user',
            isVerified: false
        });
        // Envoyer l'email de vérification
        await (0, email_1.sendVerificationEmail)(email, verificationToken);
        // Créer le token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, jwt_config_1.default.secret, { expiresIn: jwt_config_1.default.expiresIn });
        res.status(201).json({
            success: true,
            message: 'Inscription réussie. Veuillez vérifier votre email.',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
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
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Vérifier si l'utilisateur existe
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        // Vérifier le mot de passe
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }
        // Créer le token JWT
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, jwt_config_1.default.secret, { expiresIn: jwt_config_1.default.expiresIn });
        res.json({
            success: true,
            message: 'Connexion réussie',
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
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
};
exports.login = login;
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        // Vérifier le token
        const decoded = jsonwebtoken_1.default.verify(token, jwt_config_1.default.verificationSecret);
        const user = await User_1.User.findOne({ email: decoded.email, verificationToken: token });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token de vérification invalide'
            });
        }
        // Mettre à jour l'utilisateur
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.json({
            success: true,
            message: 'Email vérifié avec succès'
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la vérification de l\'email:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la vérification de l\'email'
        });
    }
};
exports.verifyEmail = verifyEmail;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Aucun utilisateur trouvé avec cet email'
            });
        }
        // Créer le token de réinitialisation
        const resetToken = jsonwebtoken_1.default.sign({ id: user._id.toString() }, jwt_config_1.default.resetSecret, { expiresIn: '1h' });
        // Mettre à jour l'utilisateur
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
        await user.save();
        // TODO: Envoyer l'email de réinitialisation
        // await sendResetPasswordEmail(email, resetToken);
        res.json({
            success: true,
            message: 'Email de réinitialisation envoyé'
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la demande de réinitialisation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la demande de réinitialisation'
        });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        // Vérifier le token
        const decoded = jsonwebtoken_1.default.verify(token, jwt_config_1.default.resetSecret);
        const user = await User_1.User.findOne({
            _id: decoded.id,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }
        // Hasher le nouveau mot de passe
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Mettre à jour l'utilisateur
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({
            success: true,
            message: 'Mot de passe réinitialisé avec succès'
        });
    }
    catch (error) {
        logger_1.logger.error('Erreur lors de la réinitialisation:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la réinitialisation du mot de passe'
        });
    }
};
exports.resetPassword = resetPassword;
