"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CinetPayConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CinetPayConfig = {
    apiKey: process.env.CINETPAY_APIKEY,
    siteId: process.env.CINETPAY_SITE_ID,
    secretKey: process.env.CINETPAY_SECRET_KEY,
    notifyUrl: process.env.NODE_ENV === 'production'
        ? 'https://api.businessconnectsenegal.com/api/payment/notify'
        : 'http://localhost:4000/api/payment/notify',
    returnUrl: process.env.NODE_ENV === 'production'
        ? 'https://businessconnectsenegal.com/payment/success'
        : 'http://localhost:3001/payment/success',
    cancelUrl: process.env.NODE_ENV === 'production'
        ? 'https://businessconnectsenegal.com/payment/cancel'
        : 'http://localhost:3001/payment/cancel'
};
//# sourceMappingURL=cinetpay.js.map