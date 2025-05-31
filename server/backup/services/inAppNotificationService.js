"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InAppNotificationService = void 0;
const logger_1 = require("../utils/logger");
class InAppNotificationService {
    constructor() {
        this.notifications = new Map();
    }
    async createNotification(userId, type, title, message, data) {
        try {
            const notification = {
                id: this.generateNotificationId(),
                userId,
                type,
                title,
                message,
                isRead: false,
                createdAt: new Date(),
                data
            };
            const userNotifications = this.notifications.get(userId) || [];
            userNotifications.push(notification);
            this.notifications.set(userId, userNotifications);
            logger_1.logger.info('Notification créée', { userId, type, title });
            return notification;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la création de la notification', { userId, error });
            throw new Error('Échec de la création de la notification');
        }
    }
    async getUserNotifications(userId) {
        try {
            return this.notifications.get(userId) || [];
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des notifications', { userId, error });
            throw new Error('Échec de la récupération des notifications');
        }
    }
    async getUnreadNotifications(userId) {
        try {
            const notifications = await this.getUserNotifications(userId);
            return notifications.filter(notification => !notification.isRead);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des notifications non lues', { userId, error });
            throw new Error('Échec de la récupération des notifications non lues');
        }
    }
    async markAsRead(userId, notificationId) {
        try {
            const userNotifications = this.notifications.get(userId) || [];
            const notification = userNotifications.find(n => n.id === notificationId);
            if (notification) {
                notification.isRead = true;
                logger_1.logger.info('Notification marquée comme lue', { userId, notificationId });
            }
        }
        catch (error) {
            logger_1.logger.error('Erreur lors du marquage de la notification comme lue', { userId, notificationId, error });
            throw new Error('Échec du marquage de la notification comme lue');
        }
    }
    async markAllAsRead(userId) {
        try {
            const userNotifications = this.notifications.get(userId) || [];
            userNotifications.forEach(notification => {
                notification.isRead = true;
            });
            logger_1.logger.info('Toutes les notifications marquées comme lues', { userId });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors du marquage de toutes les notifications comme lues', { userId, error });
            throw new Error('Échec du marquage de toutes les notifications comme lues');
        }
    }
    async deleteNotification(userId, notificationId) {
        try {
            const userNotifications = this.notifications.get(userId) || [];
            const updatedNotifications = userNotifications.filter(n => n.id !== notificationId);
            this.notifications.set(userId, updatedNotifications);
            logger_1.logger.info('Notification supprimée', { userId, notificationId });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression de la notification', { userId, notificationId, error });
            throw new Error('Échec de la suppression de la notification');
        }
    }
    generateNotificationId() {
        return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.InAppNotificationService = InAppNotificationService;
