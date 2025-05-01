import { Formation, IFormation, IModule } from '../models/formation';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export class FormationService {
  async getAllFormations(): Promise<IFormation[]> {
    try {
      const formations = await Formation.find({ status: 'published' });
      return formations;
    } catch (error) {
      logger.error('Erreur lors de la récupération des formations:', error);
      throw new AppError('Erreur lors de la récupération des formations', 500);
    }
  }

  async getFormationById(id: string): Promise<IFormation | null> {
    try {
      const formation = await Formation.findById(id);
      return formation;
    } catch (error) {
      logger.error(`Erreur lors de la récupération de la formation ${id}:`, error);
      throw new AppError('Erreur lors de la récupération de la formation', 500);
    }
  }

  async createFormation(formationData: Partial<IFormation>): Promise<IFormation> {
    try {
      const formation = new Formation(formationData);
      await formation.save();
      return formation;
    } catch (error) {
      logger.error('Erreur lors de la création de la formation:', error);
      throw new AppError('Erreur lors de la création de la formation', 500);
    }
  }

  async updateFormation(id: string, formationData: Partial<IFormation>): Promise<IFormation | null> {
    try {
      const formation = await Formation.findByIdAndUpdate(
        id,
        formationData,
        { new: true, runValidators: true }
      );
      return formation;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de la formation ${id}:`, error);
      throw new AppError('Erreur lors de la mise à jour de la formation', 500);
    }
  }

  async deleteFormation(id: string): Promise<void> {
    try {
      await Formation.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Erreur lors de la suppression de la formation ${id}:`, error);
      throw new AppError('Erreur lors de la suppression de la formation', 500);
    }
  }

  async addModule(formationId: string, moduleData: IModule): Promise<IFormation | null> {
    try {
      const formation = await Formation.findById(formationId);
      if (!formation) {
        throw new AppError('Formation non trouvée', 404);
      }

      formation.modules.push(moduleData);
      await formation.save();
      return formation;
    } catch (error) {
      logger.error(`Erreur lors de l'ajout du module à la formation ${formationId}:`, error);
      throw new AppError('Erreur lors de l\'ajout du module', 500);
    }
  }

  async updateModule(formationId: string, moduleId: string, moduleData: Partial<IModule>): Promise<IFormation | null> {
    try {
      const formation = await Formation.findOneAndUpdate(
        { _id: formationId, 'modules._id': moduleId },
        { $set: { 'modules.$': moduleData } },
        { new: true }
      );
      return formation;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour du module ${moduleId}:`, error);
      throw new AppError('Erreur lors de la mise à jour du module', 500);
    }
  }

  async deleteModule(formationId: string, moduleId: string): Promise<IFormation | null> {
    try {
      const formation = await Formation.findByIdAndUpdate(
        formationId,
        { $pull: { modules: { _id: moduleId } } },
        { new: true }
      );
      return formation;
    } catch (error) {
      logger.error(`Erreur lors de la suppression du module ${moduleId}:`, error);
      throw new AppError('Erreur lors de la suppression du module', 500);
    }
  }

  async searchFormations(query: string): Promise<IFormation[]> {
    try {
      const formations = await Formation.find(
        { $text: { $search: query }, status: 'published' },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } });
      return formations;
    } catch (error) {
      logger.error('Erreur lors de la recherche des formations:', error);
      throw new AppError('Erreur lors de la recherche des formations', 500);
    }
  }
} 