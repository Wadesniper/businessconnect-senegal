"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
class PaymentService {
    constructor() {
        if (!config_1.config.paytech.apiKey) {
            throw new Error('PAYTECH_API_KEY non configurée');
        }
        this.apiKey = config_1.config.paytech.apiKey;
        this.baseUrl = config_1.config.paytech.baseUrl;
    }
    async createPayment(data) {
        var _a, _b, _c, _d;
        try {
            if (!data.amount || data.amount <= 0) {
                throw new errors_1.AppError('Montant invalide', 400);
            }
            if (!data.currency) {
                throw new errors_1.AppError('Devise requise', 400);
            }
            const response = await axios_1.default.post(`${this.baseUrl}/api/payment/init`, {
                amount: data.amount,
                currency: data.currency,
                description: data.description || 'Paiement BusinessConnect',
                metadata: data.metadata || {}
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.data.token || !response.data.redirect_url) {
                throw new errors_1.AppError('Réponse PayTech invalide', 500);
            }
            return {
                id: response.data.token,
                amount: data.amount,
                currency: data.currency,
                status: 'pending',
                paymentUrl: response.data.redirect_url,
                metadata: data.metadata
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                logger_1.logger.error('Erreur PayTech:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new errors_1.AppError(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Erreur lors de la création du paiement', ((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) || 500);
            }
            throw error;
        }
    }
    async verifyPayment(paymentId) {
        var _a;
        try {
            if (!paymentId) {
                throw new errors_1.AppError('ID de paiement requis', 400);
            }
            const response = await axios_1.default.get(`${this.baseUrl}/api/payment/verify/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            return {
                success: response.data.status === 'completed',
                data: response.data
            };
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                logger_1.logger.error('Erreur de vérification PayTech:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                return { success: false };
            }
            throw error;
        }
    }
    async refundPayment(paymentId, amount) {
        var _a, _b, _c, _d;
        try {
            if (!paymentId) {
                throw new errors_1.AppError('ID de paiement requis', 400);
            }
            if (amount !== undefined && amount <= 0) {
                throw new errors_1.AppError('Montant de remboursement invalide', 400);
            }
            await axios_1.default.post(`${this.baseUrl}/api/payment/refund/${paymentId}`, { amount }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return true;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                logger_1.logger.error('Erreur de remboursement PayTech:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw new errors_1.AppError(((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || 'Erreur lors du remboursement', ((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) || 500);
            }
            throw error;
        }
    }
}
exports.PaymentService = PaymentService;
//# sourceMappingURL=paymentService.js.map