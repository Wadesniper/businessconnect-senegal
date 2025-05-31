"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
const authController = new authController_1.AuthController();
// Routes publiques
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/public-profile/:id', userController.getPublicProfile);
// Routes protégées (nécessitent une authentification)
router.get('/profile', auth_1.authenticate, userController.getProfile);
router.put('/profile', auth_1.authenticate, userController.updateProfile);
router.delete('/profile', auth_1.authenticate, userController.deleteProfile);
// Routes pour les préférences utilisateur
router.get('/preferences', auth_1.authenticate, userController.getPreferences);
router.put('/preferences', auth_1.authenticate, userController.updatePreferences);
// Routes pour la gestion des notifications
router.get('/notifications', auth_1.authenticate, userController.getNotifications);
router.put('/notifications/:id', auth_1.authenticate, userController.updateNotification);
router.delete('/notifications/:id', auth_1.authenticate, userController.deleteNotification);
// Routes admin
router.get('/admin/users', auth_1.authenticate, auth_1.isAdmin, userController.getAllUsers);
router.get('/admin/users/:id', auth_1.authenticate, auth_1.isAdmin, userController.getUserById);
router.put('/admin/users/:id/status', auth_1.authenticate, auth_1.isAdmin, userController.updateUserStatus);
router.delete('/admin/users/:id', auth_1.authenticate, auth_1.isAdmin, userController.deleteUser);
// Route pour obtenir les informations de l'utilisateur connecté
router.get('/me', auth_1.authenticate, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Non autorisé' });
    }
    res.json(req.user);
});
exports.default = router;
