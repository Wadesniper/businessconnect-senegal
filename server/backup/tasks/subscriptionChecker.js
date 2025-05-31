"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionChecker = void 0;
const logger_1 = require("../utils/logger");
class SubscriptionChecker {
    constructor(subscriptionService) {
        this.checkInterval = null;
        this.subscriptionService = subscriptionService;
    }
    start(intervalInHours = 24) {
        // Vérifier les abonnements toutes les X heures (par défaut 24h)
        const intervalInMs = intervalInHours * 60 * 60 * 1000;
        // Première vérification immédiate
        this.checkAllSubscriptions();
        // Planifier les vérifications suivantes
        this.checkInterval = setInterval(() => {
            this.checkAllSubscriptions();
        }, intervalInMs);
        logger_1.logger.info('Démarrage du vérificateur d\'abonnements', { intervalInHours });
    }
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            logger_1.logger.info('Arrêt du vérificateur d\'abonnements');
        }
    }
    async checkAllSubscriptions() {
        try {
            const subscriptions = await this.subscriptionService.getAllSubscriptions();
            for (const subscription of subscriptions) {
                await this.subscriptionService.checkSubscriptionAccess(subscription.userId);
            }
            logger_1.logger.info('Vérification des abonnements terminée', {
                subscriptionsChecked: subscriptions.length
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la vérification des abonnements', { error });
        }
    }
}
exports.SubscriptionChecker = SubscriptionChecker;
