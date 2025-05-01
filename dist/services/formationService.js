"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormationService = void 0;
const formation_1 = require("../models/formation");
const errors_1 = require("../utils/errors");
const logger_1 = require("../utils/logger");
const mongoose_1 = require("mongoose");
class FormationService {
    async getAllFormations() {
        try {
            const formations = await formation_1.Formation.find().lean();
            return formations;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération des formations:', error);
            throw new errors_1.AppError('Erreur lors de la récupération des formations', 500);
        }
    }
    async getFormationById(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new errors_1.AppError('ID de formation invalide', 400);
            }
            const formation = await formation_1.Formation.findById(id).lean();
            return formation;
        }
        catch (error) {
            if (error instanceof errors_1.AppError)
                throw error;
            logger_1.logger.error('Erreur lors de la récupération de la formation:', error);
            throw new errors_1.AppError('Erreur lors de la récupération de la formation', 500);
        }
    }
    async createFormation(formationData) {
        try {
            const formation = new formation_1.Formation(formationData);
            await formation.validate();
            const savedFormation = await formation.save();
            return savedFormation.toObject();
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la création de la formation:', error);
            throw new errors_1.AppError('Erreur lors de la création de la formation', 500);
        }
    }
    async updateFormation(id, updateData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new errors_1.AppError('ID de formation invalide', 400);
            }
            const formation = await formation_1.Formation.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean();
            return formation;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour de la formation:', error);
            throw new errors_1.AppError('Erreur lors de la mise à jour de la formation', 500);
        }
    }
    async deleteFormation(id) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(id)) {
                throw new errors_1.AppError('ID de formation invalide', 400);
            }
            const result = await formation_1.Formation.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression de la formation:', error);
            throw new errors_1.AppError('Erreur lors de la suppression de la formation', 500);
        }
    }
    async getFormationsByCategory(category) {
        const formations = await formation_1.Formation.find({ category }).lean();
        return formations;
    }
    async addModule(formationId, moduleData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(formationId)) {
                throw new errors_1.AppError('ID de formation invalide', 400);
            }
            const formation = await formation_1.Formation.findById(formationId);
            if (!formation)
                return null;
            const newModule = {
                ...moduleData,
                _id: new mongoose_1.Types.ObjectId(),
                order: formation.modules.length + 1
            };
            formation.modules.push(newModule);
            await formation.save();
            return formation.toObject();
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de l\'ajout du module:', error);
            throw new errors_1.AppError('Erreur lors de l\'ajout du module', 500);
        }
    }
    async updateModule(formationId, moduleId, moduleData) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(formationId) || !mongoose_1.Types.ObjectId.isValid(moduleId)) {
                throw new errors_1.AppError('ID invalide', 400);
            }
            const formation = await formation_1.Formation.findOneAndUpdate({ _id: formationId, 'modules._id': moduleId }, { $set: { 'modules.$': { ...moduleData, _id: new mongoose_1.Types.ObjectId(moduleId) } } }, { new: true, runValidators: true }).lean();
            return formation;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour du module:', error);
            throw new errors_1.AppError('Erreur lors de la mise à jour du module', 500);
        }
    }
    async deleteModule(formationId, moduleId) {
        try {
            if (!mongoose_1.Types.ObjectId.isValid(formationId) || !mongoose_1.Types.ObjectId.isValid(moduleId)) {
                throw new errors_1.AppError('ID invalide', 400);
            }
            const formation = await formation_1.Formation.findByIdAndUpdate(formationId, { $pull: { modules: { _id: moduleId } } }, { new: true }).lean();
            return formation;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la suppression du module:', error);
            throw new errors_1.AppError('Erreur lors de la suppression du module', 500);
        }
    }
    async getFormationsByInstructor(instructorId) {
        const formations = await formation_1.Formation.find({ instructor: instructorId }).lean();
        return formations;
    }
    async getFeaturedFormations() {
        const formations = await formation_1.Formation.find({ featured: true }).lean();
        return formations;
    }
    async updateFormationStatus(formationId, status) {
        const formation = await formation_1.Formation.findByIdAndUpdate(formationId, { $set: { status } }, { new: true }).lean();
        return formation;
    }
    async searchFormations(query) {
        try {
            const formations = await formation_1.Formation.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { tags: { $in: [new RegExp(query, 'i')] } }
                ]
            }).lean();
            return formations;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la recherche des formations:', error);
            throw new errors_1.AppError('Erreur lors de la recherche des formations', 500);
        }
    }
}
exports.FormationService = FormationService;
//# sourceMappingURL=formationService.js.map