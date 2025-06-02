"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvController = exports.cvValidation = void 0;
const express_validator_1 = require("express-validator");
const cv_1 = require("../models/cv");
const logger_1 = require("../utils/logger");
exports.cvValidation = [
    (0, express_validator_1.check)('title').notEmpty().withMessage('Le titre est requis'),
    (0, express_validator_1.check)('description').notEmpty().withMessage('La description est requise'),
    (0, express_validator_1.check)('skills').isArray().withMessage('Les compétences doivent être une liste'),
    (0, express_validator_1.check)('experience').isArray().withMessage('Les expériences doivent être une liste')
];
exports.cvController = {
    createCV: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const cvData = {
                ...req.body,
                user: req.user.id
            };
            const cv = await cv_1.CV.create(cvData);
            res.status(201).json({
                success: true,
                data: cv
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la création du CV:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création du CV'
            });
        }
    },
    updateCV: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const cv = await cv_1.CV.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, { new: true });
            if (!cv) {
                return res.status(404).json({
                    success: false,
                    message: 'CV non trouvé'
                });
            }
            res.json({
                success: true,
                data: cv
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du CV:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour du CV'
            });
        }
    },
    deleteCV: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const cv = await cv_1.CV.findOneAndDelete({
                _id: req.params.id,
                user: req.user.id
            });
            if (!cv) {
                return res.status(404).json({
                    success: false,
                    message: 'CV non trouvé'
                });
            }
            res.json({
                success: true,
                message: 'CV supprimé avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression du CV:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression du CV'
            });
        }
    },
    getCV: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const cv = await cv_1.CV.findOne({
                _id: req.params.id,
                user: req.user.id
            });
            if (!cv) {
                return res.status(404).json({
                    success: false,
                    message: 'CV non trouvé'
                });
            }
            res.json({
                success: true,
                data: cv
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération du CV:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération du CV'
            });
        }
    },
    getAllCVs: async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const cvs = await cv_1.CV.find({ user: req.user.id });
            res.json({
                success: true,
                data: cvs
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des CVs:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des CVs'
            });
        }
    }
};
//# sourceMappingURL=cvController.js.map