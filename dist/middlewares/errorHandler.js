"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error('Erreur serveur:', err);
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: Object.values(err.errors).map((error) => ({
                field: error.path,
                message: error.message
            }))
        });
    }
    if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(400).json({
            success: false,
            message: 'Cette ressource existe déjà'
        });
    }
    res.status(500).json({
        success: false,
        message: 'Erreur serveur'
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map