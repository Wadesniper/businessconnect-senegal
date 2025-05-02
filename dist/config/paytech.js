"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paytechConfig = void 0;
exports.paytechConfig = {
    apiKey: process.env.PAYTECH_API_KEY || '',
    apiSecret: process.env.PAYTECH_API_SECRET || '',
    apiUrl: process.env.PAYTECH_API_URL || 'https://paytech.sn',
    baseUrl: process.env.PAYTECH_BASE_URL || 'https://paytech.sn/api/v1'
};
//# sourceMappingURL=paytech.js.map