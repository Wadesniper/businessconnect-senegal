import { IFormation, IModule } from '../types/formation';
import { Formation } from '../models/formation';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export class FormationService {
  async getAllFormations(): Promise<IFormation[]> {
    const formations = await Formation.find();
    return formations;
  }

  async getFormationById(id: string): Promise<IFormation | null> {
    const formation = await Formation.findById(id);
    return formation;
  }

  async createFormation(formationData: Partial<IFormation>): Promise<IFormation> {
    const formation = await Formation.create(formationData);
    return formation;
  }

  async updateFormation(id: string, formationData: Partial<IFormation>): Promise<IFormation | null> {
    const formation = await Formation.findByIdAndUpdate(id, formationData, { new: true });
    return formation;
  }

  async deleteFormation(id: string): Promise<boolean> {
    const result = await Formation.findByIdAndDelete(id);
    return !!result;
  }

  async getFormationsByCategory(category: string): Promise<IFormation[]> {
    const formations = await Formation.find({ category });
    return formations;
  }

  async addModule(formationId: string, moduleData: IModule): Promise<IFormation | null> {
    try {
      if (!Types.ObjectId.isValid(formationId)) {
        throw new AppError('ID de formation invalide', 400);
      }
      const formation = await Formation.findById(formationId);
      if (!formation) return null;

      const newModule = {
        ...moduleData,
        _id: new Types.ObjectId(),
        order: formation.modules.length + 1
      };

      formation.modules.push(newModule);
      await formation.save();
      return formation.toObject() as IFormation;
    } catch (error) {
      logger.error('Erreur lors de l\'ajout du module:', error);
      throw new AppError('Erreur lors de l\'ajout du module', 500);
    }
  }

  async updateModule(
    formationId: string,
    moduleId: string,
    moduleData: Partial<IModule>
  ): Promise<IFormation | null> {
    try {
      if (!Types.ObjectId.isValid(formationId) || !Types.ObjectId.isValid(moduleId)) {
        throw new AppError('ID invalide', 400);
      }
      const formation = await Formation.findOneAndUpdate(
        { _id: formationId, 'modules._id': moduleId },
        { $set: { 'modules.$': { ...moduleData, _id: new Types.ObjectId(moduleId) } } },
        { new: true, runValidators: true }
      ).lean();
      return formation as IFormation | null;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du module:', error);
      throw new AppError('Erreur lors de la mise à jour du module', 500);
    }
  }

  async deleteModule(formationId: string, moduleId: string): Promise<IFormation | null> {
    try {
      if (!Types.ObjectId.isValid(formationId) || !Types.ObjectId.isValid(moduleId)) {
        throw new AppError('ID invalide', 400);
      }
      const formation = await Formation.findByIdAndUpdate(
        formationId,
        { $pull: { modules: { _id: moduleId } } },
        { new: true }
      ).lean();
      return formation as IFormation | null;
    } catch (error) {
      logger.error('Erreur lors de la suppression du module:', error);
      throw new AppError('Erreur lors de la suppression du module', 500);
    }
  }

  async getFormationsByInstructor(instructorId: string): Promise<IFormation[]> {
    const formations = await Formation.find({ instructor: instructorId }).lean();
    return formations as IFormation[];
  }

  async getFeaturedFormations(): Promise<IFormation[]> {
    const formations = await Formation.find({ featured: true }).lean();
    return formations as IFormation[];
  }

  async updateFormationStatus(
    formationId: string,
    status: 'draft' | 'published' | 'archived'
  ): Promise<IFormation | null> {
    const formation = await Formation.findByIdAndUpdate(
      formationId,
      { $set: { status } },
      { new: true }
    ).lean();
    return formation as IFormation | null;
  }

  async searchFormations(query: string): Promise<IFormation[]> {
    try {
      const formations = await Formation.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }).lean();
      return formations as IFormation[];
    } catch (error) {
      logger.error('Erreur lors de la recherche des formations:', error);
      throw new AppError('Erreur lors de la recherche des formations', 500);
    }
  }
} 