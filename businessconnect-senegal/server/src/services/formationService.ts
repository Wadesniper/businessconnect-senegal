import { Formation, Module } from '../models/formation';
import { logger } from '../utils/logger';
import { FormationFilters, FormationInput, IFormation, ModuleInput } from '../types/formation';
import { Types } from 'mongoose';
import { IModule } from '../types/formation';

export class FormationService {
  async getAllFormations(filters?: FormationFilters): Promise<IFormation[]> {
    try {
      let query = Formation.find();

      if (filters) {
        if (filters.category) query = query.where('category').equals(filters.category);
        if (filters.level) query = query.where('level').equals(filters.level);
        if (filters.status) query = query.where('status').equals(filters.status);
        if (filters.featured !== undefined) query = query.where('featured').equals(filters.featured);
        if (filters.priceMin !== undefined) query = query.where('price').gte(filters.priceMin);
        if (filters.priceMax !== undefined) query = query.where('price').lte(filters.priceMax);
        if (filters.instructorId) query = query.where('instructor').equals(filters.instructorId);
      }

      const formations = await query
        .populate('instructor', 'name email avatar')
        .sort('-createdAt')
        .lean();
      return formations as unknown as IFormation[];
    } catch (error) {
      logger.error('Erreur lors de la récupération des formations:', error);
      throw error;
    }
  }

  async getFormationById(id: string): Promise<IFormation> {
    try {
      const formation = await Formation.findById(id).lean();
      if (!formation) {
        throw new Error('Formation non trouvée');
      }
      return formation as unknown as IFormation;
    } catch (error) {
      logger.error(`Erreur lors de la récupération de la formation ${id}:`, error);
      throw error;
    }
  }

  async createFormation(data: Partial<IFormation>): Promise<IFormation> {
    const formation = await Formation.create(data);
    return formation.toObject();
  }

  async getFormation(id: string): Promise<IFormation | null> {
    const formation = await Formation.findById(id);
    return formation ? formation.toObject() : null;
  }

  async updateFormation(id: string, data: Partial<IFormation>): Promise<IFormation | null> {
    const formation = await Formation.findByIdAndUpdate(id, data, { new: true });
    return formation ? formation.toObject() : null;
  }

  async deleteFormation(id: string): Promise<boolean> {
    const result = await Formation.findByIdAndDelete(id);
    return !!result;
  }

  async addModule(formationId: string, moduleData: ModuleInput): Promise<IFormation> {
    try {
      const formation = await Formation.findById(formationId);
      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      const module = new Module({
        ...moduleData,
        description: moduleData.description || ''
      });
      formation.modules.push(module);
      const savedFormation = await formation.save();
      return savedFormation.toObject() as unknown as IFormation;
    } catch (error) {
      logger.error(`Erreur lors de l'ajout du module à la formation ${formationId}:`, error);
      throw error;
    }
  }

  async updateModule(formationId: string, moduleId: string, updateData: Partial<ModuleInput>): Promise<IFormation> {
    try {
      const formation = await Formation.findOneAndUpdate(
        { _id: formationId, 'modules._id': moduleId },
        { 
          $set: { 
            'modules.$': {
              ...updateData,
              description: updateData.description || ''
            }
          } 
        },
        { new: true }
      ).lean();

      if (!formation) {
        throw new Error('Formation ou module non trouvé');
      }

      return formation as unknown as IFormation;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour du module ${moduleId}:`, error);
      throw error;
    }
  }

  async deleteModule(formationId: string, moduleId: string): Promise<IFormation> {
    try {
      const formation = await Formation.findByIdAndUpdate(
        formationId,
        { $pull: { modules: { _id: moduleId } } },
        { new: true }
      ).exec();

      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      return formation;
    } catch (error) {
      logger.error(`Erreur lors de la suppression du module ${moduleId}:`, error);
      throw error;
    }
  }

  async enrollStudent(formationId: string, studentId: string): Promise<IFormation> {
    try {
      const formation = await Formation.findByIdAndUpdate(
        formationId,
        { $addToSet: { enrolledStudents: studentId } },
        { new: true }
      ).exec();

      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      return formation;
    } catch (error) {
      logger.error(`Erreur lors de l'inscription de l'étudiant ${studentId}:`, error);
      throw error;
    }
  }

  async unenrollStudent(formationId: string, studentId: string): Promise<IFormation> {
    try {
      const formation = await Formation.findByIdAndUpdate(
        formationId,
        { $pull: { enrolledStudents: studentId } },
        { new: true }
      ).exec();

      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      return formation;
    } catch (error) {
      logger.error(`Erreur lors de la désinscription de l'étudiant ${studentId}:`, error);
      throw error;
    }
  }

  async rateFormation(formationId: string, rating: number): Promise<IFormation> {
    try {
      const formation = await Formation.findById(formationId);
      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      const newRating = ((formation.rating * formation.numberOfRatings) + rating) / (formation.numberOfRatings + 1);
      
      formation.rating = Number(newRating.toFixed(1));
      formation.numberOfRatings += 1;
      
      await formation.save();
      return formation;
    } catch (error) {
      logger.error(`Erreur lors de l'évaluation de la formation ${formationId}:`, error);
      throw error;
    }
  }

  async searchFormations(searchTerm: string): Promise<IFormation[]> {
    try {
      const formations = await Formation.find(
        { $text: { $search: searchTerm }, status: 'published' },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .populate('instructor', 'name email avatar')
        .lean();
      
      return formations.map(formation => ({
        ...formation,
        modules: formation.modules.map(module => ({
          ...module,
          description: module.description || ''
        }))
      })) as unknown as IFormation[];
    } catch (error) {
      logger.error('Erreur lors de la recherche de formations:', error);
      throw error;
    }
  }
}

export const formationService = new FormationService(); 