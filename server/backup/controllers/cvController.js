"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cvValidation = exports.CVController = void 0;
const cvService_1 = require("../services/cvService");
const logger_1 = require("../utils/logger");
const express_validator_1 = require("express-validator");
class CVController {
    constructor() {
        this.createCV = async (req, res) => {
            var _a;
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ success: false, errors: errors.array() });
                }
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ success: false, message: 'Non autorisé' });
                }
                const cv = await this.cvService.createCV(userId, req.body);
                return res.status(201).json({ success: true, data: cv });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de la création du CV:', error);
                return res.status(500).json({ success: false, message: 'Erreur serveur' });
            }
        };
        this.updateCV = async (req, res) => {
            var _a;
            try {
                const errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ success: false, errors: errors.array() });
                }
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ success: false, message: 'Non autorisé' });
                }
                const cv = await this.cvService.updateCV(req.params.id, userId, req.body);
                if (!cv) {
                    return res.status(404).json({ success: false, message: 'CV non trouvé' });
                }
                return res.status(200).json({ success: true, data: cv });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de la mise à jour du CV:', error);
                return res.status(500).json({ success: false, message: 'Erreur serveur' });
            }
        };
        this.getCV = async (req, res) => {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ success: false, message: 'Non autorisé' });
                }
                const cv = await this.cvService.getCV(req.params.id, userId);
                if (!cv) {
                    return res.status(404).json({ success: false, message: 'CV non trouvé' });
                }
                return res.status(200).json({ success: true, data: cv });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de la récupération du CV:', error);
                return res.status(500).json({ success: false, message: 'Erreur serveur' });
            }
        };
        this.getUserCVs = async (req, res) => {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ success: false, message: 'Non autorisé' });
                }
                const cvs = await this.cvService.getUserCVs(userId);
                return res.status(200).json({ success: true, data: cvs });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de la récupération des CVs:', error);
                return res.status(500).json({ success: false, message: 'Erreur serveur' });
            }
        };
        this.deleteCV = async (req, res) => {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ success: false, message: 'Non autorisé' });
                }
                const success = await this.cvService.deleteCV(req.params.id, userId);
                if (!success) {
                    return res.status(404).json({ success: false, message: 'CV non trouvé' });
                }
                return res.status(200).json({ success: true, message: 'CV supprimé' });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de la suppression du CV:', error);
                return res.status(500).json({ success: false, message: 'Erreur serveur' });
            }
        };
        this.generatePDF = async (req, res) => {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return res.status(401).json({ success: false, message: 'Non autorisé' });
                }
                const pdfUrl = await this.cvService.generatePDF(req.params.id, userId);
                return res.status(200).json({ success: true, data: { pdfUrl } });
            }
            catch (error) {
                logger_1.logger.error('Erreur lors de la génération du PDF:', error);
                return res.status(500).json({ success: false, message: 'Erreur serveur' });
            }
        };
        this.cvService = new cvService_1.CVService();
    }
}
exports.CVController = CVController;
exports.cvValidation = {
    createCV: [
        (0, express_validator_1.body)('template')
            .isIn(['modern', 'classic', 'creative', 'professional'])
            .withMessage('Template invalide'),
        (0, express_validator_1.body)('personalInfo.firstName')
            .trim()
            .notEmpty()
            .withMessage('Le prénom est requis'),
        (0, express_validator_1.body)('personalInfo.lastName')
            .trim()
            .notEmpty()
            .withMessage('Le nom est requis'),
        (0, express_validator_1.body)('personalInfo.email')
            .trim()
            .isEmail()
            .withMessage('Email invalide'),
        (0, express_validator_1.body)('education.*.school')
            .trim()
            .notEmpty()
            .withMessage('Le nom de l\'école est requis'),
        (0, express_validator_1.body)('education.*.degree')
            .trim()
            .notEmpty()
            .withMessage('Le diplôme est requis'),
        (0, express_validator_1.body)('education.*.startDate')
            .isISO8601()
            .withMessage('Date de début invalide'),
        (0, express_validator_1.body)('experience.*.company')
            .trim()
            .notEmpty()
            .withMessage('Le nom de l\'entreprise est requis'),
        (0, express_validator_1.body)('experience.*.position')
            .trim()
            .notEmpty()
            .withMessage('Le poste est requis'),
        (0, express_validator_1.body)('experience.*.startDate')
            .isISO8601()
            .withMessage('Date de début invalide'),
        (0, express_validator_1.body)('skills.*.name')
            .trim()
            .notEmpty()
            .withMessage('Le nom de la compétence est requis'),
        (0, express_validator_1.body)('skills.*.level')
            .isIn(['débutant', 'intermédiaire', 'avancé', 'expert'])
            .withMessage('Niveau de compétence invalide'),
        (0, express_validator_1.body)('skills.*.category')
            .isIn(['technique', 'soft', 'langue'])
            .withMessage('Catégorie de compétence invalide')
    ],
    updateCV: [
        (0, express_validator_1.body)('template')
            .optional()
            .isIn(['modern', 'classic', 'creative', 'professional'])
            .withMessage('Template invalide'),
        (0, express_validator_1.body)('personalInfo.firstName')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Le prénom est requis'),
        (0, express_validator_1.body)('personalInfo.lastName')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Le nom est requis'),
        (0, express_validator_1.body)('personalInfo.email')
            .optional()
            .trim()
            .isEmail()
            .withMessage('Email invalide')
    ]
};
