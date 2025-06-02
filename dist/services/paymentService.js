"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const logger_1 = require("../utils/logger");
const appError_1 = require("../utils/appError");
class PaymentService {
    static async initializePayment(amount, currency = 'XOF', description, customerId) {
        try {
            const paymentData = {
                apikey: this.CINETPAY_API_KEY,
                site_id: this.CINETPAY_SITE_ID,
                transaction_id: `TR-${Date.now()}-${customerId}`,
                amount,
                currency,
                description,
                customer_id: customerId,
                customer_name: 'Client BusinessConnect',
                notify_url: config_1.config.CINETPAY_NOTIFY_URL,
                return_url: config_1.config.CINETPAY_RETURN_URL,
                channels: 'ALL',
                metadata: JSON.stringify({ customerId })
            };
            const response = await axios_1.default.post(`${this.CINETPAY_BASE_URL}/payment`, paymentData);
            if (response.data.code === '201') {
                return {
                    success: true,
                    paymentUrl: response.data.data.payment_url,
                    transactionId: paymentData.transaction_id
                };
            }
            logger_1.logger.error('Erreur CinetPay:', response.data);
            return {
                success: false,
                error: 'Erreur lors de l\'initialisation du paiement'
            };
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'initialisation du paiement:', error);
            return {
                success: false,
                error: 'Erreur lors de l\'initialisation du paiement'
            };
        }
    }
    static async verifyPayment(transactionId) {
        try {
            const verificationData = {
                apikey: this.CINETPAY_API_KEY,
                site_id: this.CINETPAY_SITE_ID,
                transaction_id: transactionId
            };
            const response = await axios_1.default.post(`${this.CINETPAY_BASE_URL}/verify`, verificationData);
            return response.data.code === '00';
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la vérification du paiement:', error);
            return false;
        }
    }
    async createPayment(data) {
        try {
            // TODO: Implémenter la création du paiement
            return {
                id: `PAY_${Date.now()}`,
                amount: data.amount,
                currency: data.currency,
                status: 'pending',
                paymentUrl: `https://payment.example.com/${Date.now()}`
            };
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la création du paiement:', error);
            throw new appError_1.AppError('Erreur lors de la création du paiement', 500);
        }
    }
}
exports.PaymentService = PaymentService;
PaymentService.CINETPAY_BASE_URL = config_1.config.CINETPAY_BASE_URL;
PaymentService.CINETPAY_API_KEY = config_1.config.CINETPAY_APIKEY;
PaymentService.CINETPAY_SITE_ID = config_1.config.CINETPAY_SITE_ID;
//# sourceMappingURL=paymentService.js.map