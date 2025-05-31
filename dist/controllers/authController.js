"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const logger_1 = require("../utils/logger");
class AuthController {
    constructor(notificationService) {
        this.register = async (req, res) => {
            try {
                const { firstName, lastName, email, phoneNumber, password } = req.body;
                // Validation des champs requis
                if (!firstName || !lastName || !phoneNumber || !password) {
                    return res.status(400).json({
                        success: false,
                        message: 'Veuillez remplir tous les champs obligatoires (prénom, nom, téléphone, mot de passe)'
                    });
                }
                // Validation de la longueur du mot de passe
                if (password.length < 6) {
                    return res.status(400).json({
                        success: false,
                        message: 'Le mot de passe doit contenir au moins 6 caractères'
                    });
                }
                // Validation du format de l'email si fourni
                if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
                    return res.status(400).json({
                        success: false,
                        message: 'Format d\'email invalide'
                    });
                }
                // Normalisation du téléphone
                function normalizePhone(phone) {
                    if (!phone)
                        return null;
                    // Nettoie le numéro en gardant uniquement les chiffres et le +
                    let cleaned = phone.replace(/[^0-9+]/g, '');
                    // Si le numéro commence par +, c'est déjà au format international
                    if (cleaned.startsWith('+')) {
                        // Vérifie que le numéro a une longueur valide (indicatif + 8 chiffres minimum)
                        if (cleaned.length >= 10)
                            return cleaned;
                        return null;
                    }
                    // Si le numéro commence par 77, 78, ou 76 (numéros sénégalais)
                    if (/^(77|78|76|70)\d{7}$/.test(cleaned)) {
                        return '+221' + cleaned;
                    }
                    // Si le numéro commence par un autre préfixe sénégalais
                    if (/^7\d{8}$/.test(cleaned)) {
                        return 'INVALID_PREFIX';
                    }
                    return null;
                }
                // Nettoyer et valider le numéro de téléphone
                const normalizedPhone = normalizePhone(phoneNumber);
                if (normalizedPhone === 'INVALID_PREFIX') {
                    return res.status(400).json({
                        success: false,
                        message: "Le numéro de téléphone doit commencer par 70, 76, 77 ou 78 pour les numéros sénégalais"
                    });
                }
                if (!normalizedPhone) {
                    return res.status(400).json({
                        success: false,
                        message: "Le numéro de téléphone doit être au format international (+221 77 XXX XX XX) ou sénégalais (77 XXX XX XX)"
                    });
                }
                // Vérifier si l'utilisateur existe déjà
                const existingUser = await user_1.User.findOne({ phoneNumber: normalizedPhone });
                if (existingUser) {
                    return res.status(400).json({
                        success: false,
                        message: 'Un utilisateur avec ce numéro de téléphone existe déjà'
                    });
                }
                // Si un email est fourni, vérifier s'il existe déjà
                if (email) {
                    const userWithEmail = await user_1.User.findOne({ email: email.toLowerCase() });
                    if (userWithEmail) {
                        return res.status(400).json({
                            success: false,
                            message: 'Un utilisateur avec cet email existe déjà'
                        });
                    }
                }
                // Hasher le mot de passe
                const salt = await bcrypt_1.default.genSalt(10);
                const hashedPassword = await bcrypt_1.default.hash(password, salt);
                // Créer le nouvel utilisateur avec le numéro normalisé
                const userData = {
                    firstName,
                    lastName,
                    phoneNumber: normalizedPhone,
                    password: hashedPassword,
                    role: 'etudiant' // Rôle par défaut
                };
                // Ajouter l'email seulement s'il est fourni et non vide
                if (email?.trim()) {
                    userData.email = email.toLowerCase().trim();
                }
                const user = new user_1.User(userData);
                await user.save();
                // Générer le token JWT pour la connexion immédiate
                const jwtSecret = process.env.JWT_SECRET || 'default_secret';
                const jwtExpire = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '30d';
                const options = { expiresIn: jwtExpire };
                const token = jsonwebtoken_1.default.sign({
                    id: user._id,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }, jwtSecret, options);
                // Envoyer l'email de vérification si email fourni
                if (email) {
                    try {
                        await this.notificationService.sendVerificationEmail(email, token);
                    }
                    catch (emailError) {
                        logger_1.logger.error('Erreur lors de l\'envoi de l\'email de vérification:', emailError);
                        // On continue même si l'envoi d'email échoue
                    }
                }
                // Renvoyer le token avec la réponse pour permettre la connexion immédiate
                res.status(201).json({
                    success: true,
                    message: 'Inscription réussie',
                    data: {
                        token,
                        user: {
                            id: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            role: user.role
                        }
                    }
                });
                return;
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de l\'inscription:', error);
                res.status(500).json({
                    success: false,
                    message: 'Une erreur est survenue lors de l\'inscription'
                });
                return;
            }
        };
        this.notificationService = notificationService;
    }
}
exports.default = AuthController;
//# sourceMappingURL=authController.js.map