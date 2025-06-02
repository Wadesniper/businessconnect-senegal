"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const logger_1 = require("../utils/logger");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        logger_1.logger.warn('Validation errors:', errors.array());
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg
            }))
        });
    }
    next();
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map