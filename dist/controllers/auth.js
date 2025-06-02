"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.authValidation = void 0;
const express_validator_1 = require("express-validator");
const User_1 = require("../models/User");
const authService_1 = require("../services/authService");
const notificationService_1 = require("../services/notificationService");
const logger_1 = require("../utils/logger");
exports.authValidation = [
    (0, express_validator_1.check)('email').isEmail().withMessage('Email invalide'),
    (0, express_validator_1.check)('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
];
exports.authController = {
    async register(req, res) {
        try {
            const { firstName, lastName, email, phone, password, role } = req.body;
            const existingUser = await User_1.User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Un utilisateur avec cet email existe déjà'
                });
            }
            const user = await User_1.User.create({
                firstName,
                lastName,
                email,
                phone,
                password,
                role
            });
            const token = await authService_1.AuthService.generateAuthToken(user);
            await notificationService_1.NotificationService.sendWelcomeEmail(user);
            res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
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
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await authService_1.AuthService.validateUser(email, password);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }
            const token = await authService_1.AuthService.generateAuthToken(user);
            res.status(200).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
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