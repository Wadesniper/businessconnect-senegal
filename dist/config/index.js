"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const validateConfig = () => {
    const requiredEnvVars = [
        'MONGODB_URI',
        'JWT_SECRET',
        'PAYTECH_API_KEY',
        'PAYTECH_WEBHOOK_SECRET'
    ];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
        throw new Error(`Variables d'environnement manquantes : ${missingVars.join(', ')}`);
    }
};
if (process.env.NODE_ENV === 'production') {
    validateConfig();
}
exports.config = {
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    },
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/businessconnect'
    },
    server: {
        port: process.env.PORT || 4000,
        env: process.env.NODE_ENV || 'development'
    },
    email: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        },
        from: process.env.SMTP_FROM
    },
    paytech: {
        apiKey: process.env.PAYTECH_API_KEY,
        apiSecret: process.env.PAYTECH_API_SECRET,
        webhookSecret: process.env.PAYTECH_WEBHOOK_SECRET,
        testMode: process.env.NODE_ENV !== 'production'
    },
    client: {
        url: process.env.CLIENT_URL || 'http://localhost:3000',
        apiUrl: process.env.API_URL || 'http://localhost:5000'
    }
};
//# sourceMappingURL=index.js.map