"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinetPayService = void 0;
const axios_1 = __importDefault(require("axios"));
const cinetpay_1 = require("../config/cinetpay");
class CinetPayService {
    static async initiatePayment(data) {
        try {
            const response = await axios_1.default.post(this.BASE_URL, {
                apikey: cinetpay_1.CinetPayConfig.apiKey,
                site_id: cinetpay_1.CinetPayConfig.siteId,
                transaction_id: `BC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                amount: data.amount,
                currency: data.currency || 'XOF',
                description: data.description,
                customer_name: data.customer_name,
                customer_surname: data.customer_surname,
                customer_email: data.customer_email,
                customer_phone_number: data.customer_phone_number,
                customer_address: data.customer_address,
                channels: data.channels || 'ALL',
                notify_url: cinetpay_1.CinetPayConfig.notifyUrl,
                return_url: cinetpay_1.CinetPayConfig.returnUrl,
                cancel_url: cinetpay_1.CinetPayConfig.cancelUrl,
                lang: 'fr',
                metadata: data.metadata
            });
            return {
                success: true,
                data: response.data
            };
        }
        catch (error) {
            console.error('Erreur CinetPay:', error);
            return {
                success: false,
                error: 'Erreur lors de l\'initiation du paiement'
            };
        }
    }
    static async verifyPayment(transactionId) {
        try {
            const response = await axios_1.default.post('https://api-checkout.cinetpay.com/v2/payment/check', {
                apikey: cinetpay_1.CinetPayConfig.apiKey,
                site_id: cinetpay_1.CinetPayConfig.siteId,
                transaction_id: transactionId
            });
            return {
                success: true,
                data: response.data
            };
        }
        catch (error) {
            console.error('Erreur vérification CinetPay:', error);
            return {
                success: false,
                error: 'Erreur lors de la vérification du paiement'
            };
        }
    }
}
exports.CinetPayService = CinetPayService;
CinetPayService.BASE_URL = 'https://api-checkout.cinetpay.com/v2/payment';
//# sourceMappingURL=cinetpayService.js.map