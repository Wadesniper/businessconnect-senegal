"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
exports.userController = {
    async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération du profil:', error);
            res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
        }
    },
    async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Non autorisé' });
            }
            const user = await User_1.User.findByIdAndUpdate(userId, { $set: req.body }, { new: true, runValidators: true });
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }
            res.json({
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                role: user.role
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du profil:', error);
            res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
        }
    },
    async deleteProfile(req, res) {
        try {
            const userId = req.user?.id;
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
};
//# sourceMappingURL=userController.new.js.map