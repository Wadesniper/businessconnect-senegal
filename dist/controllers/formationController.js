"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationController = void 0;
const formation_1 = require("../models/formation");
const appError_1 = require("../utils/appError");
const catchAsync_1 = require("../utils/catchAsync");
const subscriptionUtils_1 = require("../utils/subscriptionUtils");
const logger_1 = require("../utils/logger");
class FormationController {
    constructor() {
        // Accéder à une formation (vérification abonnement + redirection)
        this.accessFormation = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            const { id: formationId } = req.params;
            const userId = req.user?.id;
            if (!userId) {
                return next(new appError_1.AppError('Utilisateur non authentifié', 401));
            }
            // Vérifier l'abonnement
            const hasValidSubscription = await (0, subscriptionUtils_1.checkSubscription)(userId);
            if (!hasValidSubscription) {
                return next(new appError_1.AppError('Accès non autorisé - Abonnement requis', 403));
            }
            // Récupérer l'URL de la formation
            const formation = await formation_1.Formation.findById(formationId);
            if (!formation) {
                return next(new appError_1.AppError('Formation non trouvée', 404));
            }
            res.status(200).json({
                status: 'success',
                data: {
                    redirectUrl: formation.cursaUrl
                }
            });
        });
        // Obtenir les formations par catégorie
        this.getFormationsByCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { category } = req.params;
            const formations = await formation_1.Formation.find({ category });
            res.status(200).json({
                status: 'success',
                data: formations
            });
        });
    }
    // Obtenir toutes les formations
    async getFormations(req, res) {
        try {
            const formations = await formation_1.Formation.find();
            res.json({
                success: true,
                data: formations
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des formations:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération des formations'
            });
        }
    }
    // Obtenir une formation par ID
    async getFormationById(req, res) {
        try {
            const formation = await formation_1.Formation.findById(req.params.id);
            if (!formation) {
                return res.status(404).json({
                    success: false,
                    message: 'Formation non trouvée'
                });
            }
            res.json({
                success: true,
                data: formation
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération de la formation:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la récupération de la formation'
            });
        }
    }
    // Ajouter une nouvelle formation (admin seulement)
    async createFormation(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const formation = await formation_1.Formation.create({
                ...req.body,
                createdBy: req.user.id
            });
            res.status(201).json({
                success: true,
                data: formation
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la création de la formation:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la création de la formation'
            });
        }
    }
    async updateFormation(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const formation = await formation_1.Formation.findOneAndUpdate({ _id: req.params.id, createdBy: req.user.id }, req.body, { new: true });
            if (!formation) {
                return res.status(404).json({
                    success: false,
                    message: 'Formation non trouvée'
                });
            }
            res.json({
                success: true,
                data: formation
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour de la formation:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la mise à jour de la formation'
            });
        }
    }
    async deleteFormation(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilisateur non authentifié'
                });
            }
            const formation = await formation_1.Formation.findOneAndDelete({
                _id: req.params.id,
                createdBy: req.user.id
            });
            if (!formation) {
                return res.status(404).json({
                    success: false,
                    message: 'Formation non trouvée'
                });
            }
            res.json({
                success: true,
                message: 'Formation supprimée avec succès'
            });
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression de la formation:', error);
            res.status(500).json({
                success: false,
                message: 'Erreur lors de la suppression de la formation'
            });
        }
    }
}
exports.FormationController = FormationController;
//# sourceMappingURL=formationController.js.map