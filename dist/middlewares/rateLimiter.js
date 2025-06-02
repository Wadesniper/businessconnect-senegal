"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = require("../utils/logger");
exports.rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    statusCode: 429,
    message: {
        success: false,
        message: 'Trop de requêtes, veuillez réessayer plus tard.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: 'Trop de requêtes, veuillez réessayer plus tard.'
        });
    },
    keyGenerator: (req) => req.ip,
    requestPropertyName: 'rateLimit',
    skipFailedRequests: false,
    skipSuccessfulRequests: false,
    onLimitReached: (req) => {
        logger_1.logger.warn(`Rate limit reached for IP: ${req.ip}`);
    },
    validate: true,
    store: undefined,
    skip: (req) => false,
    requestWasSuccessful: (req, res) => res.statusCode < 400
});
//# sourceMappingURL=rateLimiter.js.map