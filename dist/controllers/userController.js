"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const notificationService_1 = require("../services/notificationService");
exports.userController = {
    register: async (req, res) => {
        try {
            const { firstName, lastName, email, phone, password, role } = req.body;
            const user = await User_1.User.create({
                firstName,
                lastName,
                email,
                phone,
                password,
                role
            });
            await notificationService_1.NotificationService.sendWelcomeEmail(user);
            res.status(201).json({
                success: true,
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
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User_1.User.findOne({ email }).select('+password');
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }
            res.status(200).json({
                success: true,
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
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await User_1.User.findOne({ email });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Aucun utilisateur trouvé avec cet email'
                });
            }
            const resetToken = Math.random().toString(36).substring(2, 15);
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 heure
            await user.save();
            await notificationService_1.NotificationService.sendPasswordResetEmail(user, resetToken);
            res.json({
                success: true,
                message: 'Email de réinitialisation envoyé'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la réinitialisation du mot de passe'
            });
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
            const user = await User_1.User.findOne({
                resetPasswordToken: token,
                resetPasswordExpire: { $gt: Date.now() }
            });
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Token invalide ou expiré'
                });
            }
            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            res.json({
                success: true,
                message: 'Mot de passe réinitialisé avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la réinitialisation du mot de passe'
            });
        }
    },
    getProfile: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const user = await User_1.User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.json({
                success: true,
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
            logger_1.logger.error('Erreur lors de la récupération du profil:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du profil'
            });
        }
    },
    updateProfile: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const user = await User_1.User.findByIdAndUpdate(req.user.id, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone
            }, { new: true });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.json({
                success: true,
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
            logger_1.logger.error('Erreur lors de la mise à jour du profil:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour du profil'
            });
        }
    },
    updatePassword: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const user = await User_1.User.findById(req.user.id).select('+password');
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            const { currentPassword, newPassword } = req.body;
            if (!(await user.comparePassword(currentPassword))) {
                return res.status(401).json({
                    success: false,
                    message: 'Mot de passe actuel incorrect'
                });
            }
            user.password = newPassword;
            await user.save();
            res.json({
                success: true,
                message: 'Mot de passe mis à jour avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du mot de passe:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour du mot de passe'
            });
        }
    },
    deleteAccount: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            await User_1.User.findByIdAndDelete(req.user.id);
            res.json({
                success: true,
                message: 'Compte supprimé avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression du compte:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression du compte'
            });
        }
    },
    getAllUsers: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const users = await User_1.User.find();
            res.json({
                success: true,
                users: users.map(user => ({
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }))
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des utilisateurs'
            });
        }
    },
    updateUser: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const user = await User_1.User.findByIdAndUpdate(req.params.id, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role
            }, { new: true });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.json({
                success: true,
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
            logger_1.logger.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de l\'utilisateur'
            });
        }
    },
    deleteUser: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const user = await User_1.User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilisateur non trouvé'
                });
            }
            res.json({
                success: true,
                message: 'Utilisateur supprimé avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression de l\'utilisateur:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression de l\'utilisateur'
            });
        }
    },
    async getPreferences(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findById(userId)
                .select('preferences')
                .lean()
                .exec();
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user.preferences || {});
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des préférences:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des préférences' });
        }
    },
    async updatePreferences(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findByIdAndUpdate(userId, { $set: { preferences: req.body } }, { new: true, runValidators: true })
                .select('preferences')
                .lean()
                .exec();
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user.preferences);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour des préférences:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour des préférences' });
        }
    },
    async getNotifications(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findById(userId)
                .select('notifications')
                .lean()
                .exec();
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user.notifications || []);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des notifications:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
        }
    },
    async updateNotificationStatus(req, res) {
        try {
            const userId = req.user?.id;
            const { notificationId } = req.params;
            const { read } = req.body;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findOneAndUpdate({
                _id: userId,
                'notifications.id': notificationId
            }, {
                $set: { 'notifications.$.read': read }
            }, { new: true })
                .select('notifications')
                .lean()
                .exec();
            if (!user) {
                return res.status(404).json({ error: 'Notification non trouvée' });
            }
            res.json({ message: 'Statut de notification mis à jour avec succès' });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du statut de notification:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de notification' });
        }
    }
};
//# sourceMappingURL=userController.js.map