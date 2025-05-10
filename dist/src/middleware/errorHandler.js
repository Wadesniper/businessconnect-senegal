"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Erreur:', err);
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            message: 'Erreur de validation',
            errors: Object.values(err.errors).map((error) => error.message)
        });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(409).json({
            status: 'error',
            message: 'Conflit de données'
        });
    }
    res.status(500).json({
        status: 'error',
        message: 'Erreur interne du serveur'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map