"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, _req, res, _next) => {
    logger_1.logger.error(err.message);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Une erreur est survenue sur le serveur';
    res.status(statusCode).json({
        success: false,
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
exports.errorHandler = errorHandler;
