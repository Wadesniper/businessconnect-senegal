import { IFormation, IModule } from '../types/formation';
import { Formation } from '../models/formation';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export class FormationService {
  async getAllFormations(): Promise<IFormation[]> {
    const formations = await Formation.find().lean();
    return formations as IFormation[];
  }

  async getFormationById(id: string): Promise<IFormation | null> {
    const formation = await Formation.findById(id).lean();
    return formation as IFormation;
  }

  async createFormation(formationData: Partial<IFormation>): Promise<IFormation> {
    const formation = await Formation.create(formationData);
    return formation.toObject() as IFormation;
  }

  async updateFormation(id: string, updateData: Partial<IFormation>): Promise<IFormation | null> {
    const formation = await Formation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();
    
    return formation as IFormation;
  }

  async deleteFormation(id: string): Promise<IFormation | null> {
    const formation = await Formation.findByIdAndDelete(id).lean();
    return formation as IFormation;
  }

  async getFormationsByCategory(category: string): Promise<IFormation[]> {
    const formations = await Formation.find({ category }).lean();
    return formations as IFormation[];
  }

  async addModuleToFormation(formationId: string, moduleData: IModule): Promise<IFormation> {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      throw new AppError('Formation non trouvée', 404);
    }

    formation.modules.push(moduleData as any);
    await formation.save();
    return formation.toObject() as IFormation;
  }

  async updateModule(
    formationId: string,
    moduleId: string,
    moduleData: Partial<IModule>
  ): Promise<IFormation> {
    const formation = await Formation.findOneAndUpdate(
      { _id: formationId, 'modules._id': moduleId },
      { $set: { 'modules.$': moduleData } },
      { new: true }
    ).lean();

    if (!formation) {
      throw new AppError('Formation ou module non trouvé', 404);
    }

    return formation as IFormation;
  }

  async deleteModule(formationId: string, moduleId: string): Promise<IFormation> {
    const formation = await Formation.findByIdAndUpdate(
      formationId,
      { $pull: { modules: { _id: moduleId } } },
      { new: true }
    ).lean();

    if (!formation) {
      throw new AppError('Formation ou module non trouvé', 404);
    }

    return formation as IFormation;
  }

  async getFeaturedFormations(): Promise<IFormation[]> {
    const formations = await Formation.find({ featured: true }).lean();
    return formations as IFormation[];
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