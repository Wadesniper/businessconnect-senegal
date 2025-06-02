"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userValidation = {
    create: [
        (0, express_validator_1.check)('firstName')
            .notEmpty()
            .withMessage('Le prénom est requis')
            .isLength({ min: 2 })
            .withMessage('Le prénom doit contenir au moins 2 caractères'),
        (0, express_validator_1.check)('lastName')
            .notEmpty()
            .withMessage('Le nom est requis')
            .isLength({ min: 2 })
            .withMessage('Le nom doit contenir au moins 2 caractères'),
        (0, express_validator_1.check)('email')
            .notEmpty()
            .withMessage('L\'email est requis')
            .isEmail()
            .withMessage('Email invalide'),
        (0, express_validator_1.check)('phone')
            .notEmpty()
            .withMessage('Le numéro de téléphone est requis')
            .matches(/^\+?[1-9]\d{1,14}$/)
            .withMessage('Numéro de téléphone invalide'),
        (0, express_validator_1.check)('password')
            .notEmpty()
            .withMessage('Le mot de passe est requis')
            .isLength({ min: 6 })
            .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
        (0, express_validator_1.check)('role')
            .notEmpty()
            .withMessage('Le rôle est requis')
            .isIn(['admin', 'etudiant', 'annonceur', 'employeur'])
            .withMessage('Rôle invalide')
    ],
    update: [
        (0, express_validator_1.check)('firstName')
            .optional()
            .isLength({ min: 2 })
            .withMessage('Le prénom doit contenir au moins 2 caractères'),
        (0, express_validator_1.check)('lastName')
            .optional()
            .isLength({ min: 2 })
            .withMessage('Le nom doit contenir au moins 2 caractères'),
        (0, express_validator_1.check)('email')
            .optional()
            .isEmail()
            .withMessage('Email invalide'),
        (0, express_validator_1.check)('phone')
            .optional()
            .matches(/^\+?[1-9]\d{1,14}$/)
            .withMessage('Numéro de téléphone invalide'),
        (0, express_validator_1.check)('password')
            .optional()
            .isLength({ min: 6 })
            .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
        (0, express_validator_1.check)('role')
            .optional()
            .isIn(['admin', 'etudiant', 'annonceur', 'employeur'])
            .withMessage('Rôle invalide')
    ]
};
//# sourceMappingURL=validation.js.map