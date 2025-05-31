"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
class UserController {
    async getPublicProfile(req, res) {
        try {
            const user = await User_1.User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération du profil public:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération du profil public' });
        }
    }
    async getProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération du profil:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
        }
    }
    async updateProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findByIdAndUpdate(userId, {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email
            }, { new: true });
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du profil:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
        }
    }
    async deleteProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json({ message: 'Profil supprimé avec succès' });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression du profil:', error);
            res.status(500).json({ error: 'Erreur lors de la suppression du profil' });
        }
    }
    async getPreferences(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findById(userId).select('preferences');
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user.preferences);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des préférences:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des préférences' });
        }
    }
    async updatePreferences(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findByIdAndUpdate(userId, { preferences: req.body }, { new: true });
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user.preferences);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour des préférences:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour des préférences' });
        }
    }
    async getNotifications(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findById(userId).select('notifications');
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user.notifications);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des notifications:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
        }
    }
    async updateNotification(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const notificationId = req.params.id;
            const user = await User_1.User.findOneAndUpdate({ _id: userId, 'notifications._id': notificationId }, { 'notifications.$.read': true }, { new: true });
            if (!user) {
                return res.status(404).json({ error: 'Notification non trouvée' });
            }
            res.json({ message: 'Notification mise à jour avec succès' });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour de la notification:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de la notification' });
        }
    }
    async deleteNotification(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const notificationId = req.params.id;
            const user = await User_1.User.findByIdAndUpdate(userId, { $pull: { notifications: { _id: notificationId } } }, { new: true });
            if (!user) {
                return res.status(404).json({ error: 'Notification non trouvée' });
            }
            res.json({ message: 'Notification supprimée avec succès' });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression de la notification:', error);
            res.status(500).json({ error: 'Erreur lors de la suppression de la notification' });
        }
    }
    async getAllUsers(req, res) {
        var _a;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const users = await User_1.User.find().select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');
            res.json(users);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
        }
    }
    async getUserById(req, res) {
        var _a;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const user = await User_1.User.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération de l\'utilisateur:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
        }
    }
    async updateUserStatus(req, res) {
        var _a;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const { status } = req.body;
            const userId = req.params.id;
            const user = await User_1.User.findByIdAndUpdate(userId, { status }, { new: true }).select('-password -resetPasswordToken -resetPasswordExpires -verificationToken');
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json(user);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du statut:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
        }
    }
    async deleteUser(req, res) {
        var _a;
        try {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                return res.status(403).json({ error: 'Accès non autorisé' });
            }
            const userId = req.params.id;
            const user = await User_1.User.findByIdAndDelete(userId);
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json({ message: 'Utilisateur supprimé avec succès' });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression de l\'utilisateur:', error);
            res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
        }
    }
}
exports.UserController = UserController;
