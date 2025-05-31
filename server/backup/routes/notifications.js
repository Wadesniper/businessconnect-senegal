"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationService_1 = require("../services/notificationService");
const router = (0, express_1.Router)();
// Récupérer toutes les notifications d'un utilisateur
router.get('/', async (req, res) => {
    try {
        const notifications = await notificationService_1.notificationService.getUserNotifications(req.user.id);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des notifications' });
    }
});
// Récupérer les notifications non lues
router.get('/unread', async (req, res) => {
    try {
        const notifications = await notificationService_1.notificationService.getUnreadNotifications(req.user.id);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des notifications non lues' });
    }
});
// Marquer une notification comme lue
router.put('/:notificationId/read', async (req, res) => {
    try {
        const { notificationId } = req.params;
        await notificationService_1.notificationService.markAsRead(req.user.id, notificationId);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors du marquage de la notification' });
    }
});
// Marquer toutes les notifications comme lues
router.put('/read-all', async (req, res) => {
    try {
        await notificationService_1.notificationService.markAllAsRead(req.user.id);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors du marquage des notifications' });
    }
});
// Supprimer une notification
router.delete('/:notificationId', async (req, res) => {
    try {
        const { notificationId } = req.params;
        await notificationService_1.notificationService.deleteNotification(req.user.id, notificationId);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la notification' });
    }
});
exports.default = router;
