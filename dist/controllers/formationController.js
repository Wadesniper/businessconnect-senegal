"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationController = void 0;
const formation_1 = require("../models/formation");
const appError_1 = require("../utils/appError");
const catchAsync_1 = require("../utils/catchAsync");
const subscriptionUtils_1 = require("../utils/subscriptionUtils");
class FormationController {
    constructor() {
        this.getAllFormations = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const formations = await formation_1.Formation.find();
            res.status(200).json({
                status: 'success',
                data: formations
            });
        });
        this.getFormation = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            const formation = await formation_1.Formation.findById(req.params.id);
            if (!formation) {
                return next(new appError_1.AppError('Formation non trouvée', 404));
            }
            res.status(200).json({
                status: 'success',
                data: formation
            });
        });
        this.accessFormation = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            var _a;
            const { id: formationId } = req.params;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
            if (!userId) {
                return next(new appError_1.AppError('Utilisateur non authentifié', 401));
            }
            const hasValidSubscription = await (0, subscriptionUtils_1.checkSubscription)(userId);
            if (!hasValidSubscription) {
                return next(new appError_1.AppError('Accès non autorisé - Abonnement requis', 403));
            }
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
        this.getFormationsByCategory = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const { category } = req.params;
            const formations = await formation_1.Formation.find({ category });
            res.status(200).json({
                status: 'success',
                data: formations
            });
        });
        this.addFormation = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const formation = await formation_1.Formation.create(req.body);
            res.status(201).json({
                status: 'success',
                data: formation
            });
        });
    }
}
exports.FormationController = FormationController;
//# sourceMappingURL=formationController.js.map