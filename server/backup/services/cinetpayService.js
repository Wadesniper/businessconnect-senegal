"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cinetpayService = exports.CinetpayService = void 0;
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const config_1 = require("../config");
class CinetpayService {
    async initializePayment(params) {
        var _a, _b, _c;
        const transaction_id = params.transaction_id || (0, uuid_1.v4)();
        const body = {
            apikey: config_1.config.CINETPAY_APIKEY,
            site_id: config_1.config.CINETPAY_SITE_ID,
            transaction_id,
            amount: params.amount,
            currency: params.currency || 'XOF',
            description: params.description || 'Abonnement BusinessConnect',
            return_url: config_1.config.CINETPAY_RETURN_URL || `${config_1.config.CLIENT_URL}/payment/return`,
            notify_url: config_1.config.CINETPAY_NOTIFY_URL || `${config_1.config.API_URL}/api/subscriptions/notify`,
            customer_name: params.customer_name,
            customer_surname: params.customer_surname,
            customer_email: params.customer_email,
            customer_phone_number: params.customer_phone_number,
            customer_address: params.customer_address || 'Dakar',
            customer_city: params.customer_city || 'Dakar',
            customer_country: params.customer_country || 'SN',
            customer_state: params.customer_state || 'DK',
            customer_zip_code: params.customer_zip_code || '12000',
            channels: 'ALL',
            metadata: '{}',
        };
        try {
            const response = await axios_1.default.post(config_1.config.CINETPAY_BASE_URL, body, {
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'BusinessConnect-Senegal/1.0'
                }
            });
            if ((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.payment_url) {
                return {
                    payment_url: response.data.data.payment_url,
                    transaction_id,
                };
            }
            else {
                throw new Error('Erreur lors de la génération du lien de paiement CinetPay');
            }
        }
        catch (error) {
            if ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) {
                throw new Error(`Erreur CinetPay: ${error.response.data.message || error.response.data.error}`);
            }
            throw error;
        }
    }
}
exports.CinetpayService = CinetpayService;
exports.cinetpayService = new CinetpayService();
