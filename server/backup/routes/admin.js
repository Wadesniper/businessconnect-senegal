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
// Liste des abonnements (admin)
router.get('/subscriptions', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { subscriptionService } = require('../services/subscriptionService');
        const total = await require('../models/subscription').Subscription.countDocuments();
        const allSubs = await require('../models/subscription').Subscription.find().skip(skip).limit(limit).lean();
        // Enrichir avec le nom de l'utilisateur si besoin
        const { User } = require('../models/User');
        const subscriptions = await Promise.all(allSubs.map(async (sub) => {
            const user = await User.findById(sub.userId);
            return {
                id: sub._id,
                userId: sub.userId,
                userName: user ? user.name : '',
                type: sub.plan,
                status: sub.status,
                startDate: sub.startDate,
                endDate: sub.endDate,
                amount: sub.amount || 0,
            };
        }));
        res.json({ data: subscriptions, total });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des abonnements' });
    }
});
// Liste des offres d'emploi (admin)
router.get('/jobs', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const Job = require('../models/Job').default;
        const total = await Job.countDocuments();
        const jobs = await Job.find().skip(skip).limit(limit).lean();
        // Enrichir avec le nombre de candidatures si besoin (stub applications = 0)
        const jobsWithApplications = jobs.map((job) => ({
            id: job._id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            status: job.status || 'active',
            createdAt: job.createdAt,
            applications: 0 // À remplacer par le vrai nombre si la logique existe
        }));
        res.json({ data: jobsWithApplications, total });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des offres d\'emploi' });
    }
});
// Liste des articles marketplace (admin)
router.get('/marketplace/items', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const { MarketplaceItem } = require('../models/marketplace');
        const total = await MarketplaceItem.countDocuments();
        const items = await MarketplaceItem.find().skip(skip).limit(limit).lean();
        const formatted = items.map((item) => ({
            id: item._id,
            title: item.title,
            description: item.description,
            price: item.price,
            seller: item.seller,
            category: item.category,
            status: item.status,
            images: item.images,
            createdAt: item.createdAt,
            reports: item.reports || 0
        }));
        res.json({ data: formatted, total });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des articles marketplace' });
    }
});
// Modération d'un article marketplace (approve/reject)
router.post('/marketplace/items/:id/moderate', async (req, res) => {
    try {
        const { action, reason } = req.body;
        const { id } = req.params;
        const { MarketplaceItem } = require('../models/marketplace');
        const item = await MarketplaceItem.findById(id);
        if (!item) {
            res.status(404).json({ error: 'Article non trouvé' });
            return;
        }
        if (action === 'approve') {
            item.status = 'approved';
        }
        else if (action === 'reject') {
            item.status = 'rejected';
            // On pourrait logguer la raison ici si besoin
        }
        else {
            res.status(400).json({ error: 'Action invalide' });
            return;
        }
        await item.save();
        res.json({ success: true, item });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la modération de l\'article' });
    }
});
// Statistiques globales (admin)
router.get('/statistics', async (req, res) => {
    var _a;
    try {
        const { User } = require('../models/User');
        const Job = require('../models/Job').default;
        const { Subscription } = require('../models/subscription');
        // Comptages globaux
        const users = await User.countDocuments();
        const jobs = await Job.countDocuments();
        const subscriptions = await Subscription.countDocuments({ status: 'active' });
        const revenueAgg = await Subscription.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const revenue = ((_a = revenueAgg[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        // Croissance utilisateurs (stub : 7 derniers jours)
        const userGrowth = Array.from({ length: 7 }, (_, i) => ({
            date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
            count: Math.floor(users / 7) + Math.floor(Math.random() * 10)
        }));
        // Distribution abonnements (stub : par type)
        const subTypes = await Subscription.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$plan', count: { $sum: 1 } } }
        ]);
        const subscriptionDistribution = subTypes.map((s) => ({ type: s._id, count: s.count }));
        res.json({ users, jobs, subscriptions, revenue, userGrowth, subscriptionDistribution });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
    }
});
// TODO: Ajouter ici les routes jobs, subscriptions, statistics, forum, marketplace selon les modèles/disponibilité
// Exemple :
// router.get('/jobs', ...);
// router.get('/subscriptions', ...);
// router.get('/statistics', ...);
// router.get('/forum/posts', ...);
// router.get('/marketplace/items', ...);
exports.default = router;
