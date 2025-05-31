"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const User_1 = require("../models/User");
// Importe les modèles nécessaires pour jobs, subscriptions, etc. si existants
const router = (0, express_1.Router)();
// Toutes les routes admin sont protégées
router.use(authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin);
// Liste des utilisateurs
router.get('/users', async (req, res) => {
    const users = await User_1.User.find();
    res.json(users);
});
// TODO: Ajouter ici les routes jobs, subscriptions, statistics, forum, marketplace selon les modèles/disponibilité
// Exemple :
// router.get('/jobs', ...);
// router.get('/subscriptions', ...);
// router.get('/statistics', ...);
// router.get('/forum/posts', ...);
// router.get('/marketplace/items', ...);
exports.default = router;
