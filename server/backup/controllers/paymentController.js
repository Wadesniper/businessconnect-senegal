"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const logger_1 = require("../utils/logger");
const database_1 = require("../config/database");
const pdfService_1 = require("../services/pdfService");
const errors_1 = require("../utils/errors");
const subscriptionService_1 = require("../services/subscriptionService");
exports.paymentController = {
    async createSetupIntent(req, res) {
        try {
            const { user } = req;
            if (!user) {
                res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
                return;
            }
            res.json({ setupIntent: 'TODO' });
        }
        catch (error) {
            logger_1.logger.error('Error creating setup intent:', error);
            res.status(500).json({ status: 'error', message: 'Erreur lors de la configuration du paiement' });
        }
    },
    async getPaymentMethods(_, res) {
        try {
            res.json({ payment_methods: [] });
        }
        catch (error) {
            logger_1.logger.error('Error fetching payment methods:', error);
            res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération des méthodes de paiement' });
        }
    },
    async deletePaymentMethod(_, res) {
        try {
            res.json({ success: true });
        }
        catch (error) {
            logger_1.logger.error('Error deleting payment method:', error);
            res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression de la méthode de paiement' });
        }
    },
    async processPayment(req, res) {
        try {
            const { user } = req;
            if (!user) {
                res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
                return;
            }
            res.json({ paymentIntent: 'TODO' });
            return;
        }
        catch (error) {
            logger_1.logger.error('Error processing payment:', error);
            res.status(500).json({ status: 'error', message: 'Erreur lors du traitement du paiement' });
            return;
        }
    },
    async createSubscription(req, res) {
        try {
            const { user } = req;
            if (!user) {
                res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
                return;
            }
            const { type, customer_name, customer_surname, customer_email, customer_phone_number } = req.body;
            if (!type || !customer_name || !customer_surname || !customer_email || !customer_phone_number) {
                res.status(400).json({ status: 'error', message: 'Informations incomplètes pour l\'abonnement' });
                return;
            }
            const { redirectUrl, paymentId } = await subscriptionService_1.subscriptionService.initiatePayment({
                type,
                customer_name,
                customer_surname,
                customer_email,
                customer_phone_number,
                userId: user.id
            });
            res.json({ success: true, data: { payment_url: redirectUrl, paymentId } });
            return;
        }
        catch (error) {
            logger_1.logger.error('Error creating subscription:', error);
            res.status(500).json({ status: 'error', message: 'Erreur lors de la création de l\'abonnement' });
            return;
        }
    },
    async cancelSubscription(req, res) {
        try {
            const { user } = req;
            if (!user) {
                res.status(401).json({ status: 'error', message: 'Utilisateur non authentifié' });
                return;
            }
            res.json({ success: true });
            return;
        }
        catch (error) {
            logger_1.logger.error('Error canceling subscription:', error);
            res.status(500).json({ status: 'error', message: 'Erreur lors de l\'annulation de l\'abonnement' });
            return;
        }
    },
    async refundPayment(_, res) {
        try {
            res.json({ refund: 'TODO' });
            return;
        }
        catch (error) {
            logger_1.logger.error('Error processing refund:', error);
            res.status(500).json({ status: 'error', message: 'Erreur lors du remboursement' });
            return;
        }
    },
    async getInvoices(_, res) {
        try {
            res.json({ invoices: [] });
            return;
        }
        catch (error) {
            logger_1.logger.error('Error fetching invoices:', error);
            res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération des factures' });
            return;
        }
    },
    async getInvoice(_, res) {
        try {
            res.json({ invoice: null });
            return;
        }
        catch (error) {
            logger_1.logger.error('Error fetching invoice:', error);
            res.status(500).json({ status: 'error', message: 'Erreur lors de la récupération de la facture' });
            return;
        }
    },
    async downloadInvoice(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            const { id } = req.params;
            const invoice = await (0, database_1.query)(`
        SELECT * FROM invoices WHERE id = $1 AND user_id = $2
      `, [id, userId]);
            if (invoice.rows.length === 0) {
                throw new errors_1.AppError('Facture non trouvée', 404);
            }
            const filePath = await pdfService_1.pdfService.getInvoicePath(invoice.rows[0].invoice_id);
            if (!filePath) {
                throw new errors_1.AppError('Fichier de facture non trouvé', 404);
            }
            res.download(filePath);
        }
        catch (error) {
            logger_1.logger.error('Erreur lors du téléchargement de la facture:', error);
            if (error instanceof errors_1.AppError) {
                res.status(error.statusCode).json({
                    status: 'error',
                    message: error.message
                });
            }
            else {
                res.status(500).json({
                    status: 'error',
                    message: 'Erreur lors du téléchargement de la facture'
                });
            }
        }
    },
    async handleWebhook(req, res) {
        try {
            const body = req.body;
            const { type, data, paymentId, status, ref_command } = body;
            if (type === 'payment.success' && data && data.paymentId) {
                const [, , userId] = data.ref_command ? data.ref_command.split('-') : [];
                if (userId) {
                    await subscriptionService_1.subscriptionService.updateSubscription(userId, {
                        status: 'active',
                        paymentId: data.paymentId,
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    });
                }
            }
            else if (status === 'ACCEPTED' && paymentId && ref_command) {
                const [, , userId] = ref_command.split('-');
                if (userId) {
                    await subscriptionService_1.subscriptionService.updateSubscription(userId, {
                        status: 'active',
                        paymentId,
                        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    });
                }
            }
            res.status(200).json({ received: true });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors du traitement du webhook:', error);
            res.status(500).json({ error: 'Erreur lors du traitement du webhook' });
        }
    }
};
//# sourceMappingURL=paymentController.js.map