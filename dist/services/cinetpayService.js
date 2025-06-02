"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinetPayService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const appError_1 = require("../utils/appError");
const logger_1 = require("../utils/logger");
class CinetPayService {
    constructor() {
        this.apiKey = config_1.config.CINETPAY_APIKEY;
        this.siteId = config_1.config.CINETPAY_SITE_ID;
        this.apiUrl = config_1.config.CINETPAY_BASE_URL;
    }
    async createPayment(paymentData) {
        try {
            const response = await axios_1.default.post(this.apiUrl, {
                apikey: this.apiKey,
                site_id: this.siteId,
                transaction_id: paymentData.trans_id,
                amount: paymentData.amount,
                currency: paymentData.currency,
                description: paymentData.description,
                return_url: paymentData.return_url,
                cancel_url: paymentData.cancel_url,
                notify_url: config_1.config.CINETPAY_NOTIFY_URL,
                customer_name: paymentData.customer_name,
                customer_email: paymentData.customer_email,
                channels: 'ALL',
                lang: 'fr',
                metadata: 'subscription'
            });
            if (response.data?.data?.payment_url) {
                return {
                    success: true,
                    payment_url: response.data.data.payment_url
                };
            }
            return {
                success: false,
                message: response.data.message || 'URL de paiement non disponible'
            };
        }
        catch (error) {
            console.error('Erreur CinetPay:', error);
            return {
                success: false,
                message: 'Erreur lors de la création du paiement'
            };
        }
    }
    async initializePayment(paymentData) {
        try {
            // TODO: Implémenter l'intégration CinetPay
            return {
                transaction_id: `TRANS_${Date.now()}`,
                payment_url: `https://checkout.cinetpay.com/${Date.now()}`
            };
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'initialisation du paiement CinetPay:', error);
            throw new appError_1.AppError('Erreur lors de l\'initialisation du paiement', 500);
        }
    }
}
exports.CinetPayService = CinetPayService;
//# sourceMappingURL=cinetpayService.js.map