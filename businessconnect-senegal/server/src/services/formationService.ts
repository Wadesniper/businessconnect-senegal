import { Formation, Module } from '../models/formation';
import { logger } from '../utils/logger';
import { FormationFilters, FormationInput, IFormation, ModuleInput } from '../types/formation';

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

      return await query
        .populate('instructor', 'name email avatar')
        .sort('-createdAt')
        .exec();
    } catch (error) {
      logger.error('Erreur lors de la récupération des formations:', error);
      throw error;
    }
  }

  async getFormationById(id: string): Promise<IFormation> {
    try {
      const formation = await Formation.findById(id)
        .populate('instructor', 'name email avatar')
        .populate('enrolledStudents', 'name email avatar')
        .exec();

      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      return formation;
    } catch (error) {
      logger.error(`Erreur lors de la récupération de la formation ${id}:`, error);
      throw error;
    }
  }

  async createFormation(formationData: FormationInput): Promise<IFormation> {
    try {
      const formation = new Formation({
        ...formationData,
        rating: 0,
        numberOfRatings: 0,
        enrolledStudents: [],
        status: formationData.status || 'draft'
      });

      await formation.save();
      return formation;
    } catch (error) {
      logger.error('Erreur lors de la création de la formation:', error);
      throw error;
    }
  }

  async updateFormation(id: string, updateData: Partial<FormationInput>): Promise<IFormation> {
    try {
      const formation = await Formation.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).exec();

      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      return formation;
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour de la formation ${id}:`, error);
      throw error;
    }
  }

  async deleteFormation(id: string): Promise<void> {
    try {
      const formation = await Formation.findByIdAndDelete(id).exec();
      if (!formation) {
        throw new Error('Formation non trouvée');
      }
    } catch (error) {
      logger.error(`Erreur lors de la suppression de la formation ${id}:`, error);
      throw error;
    }
  }

  async addModule(formationId: string, moduleData: ModuleInput): Promise<IFormation> {
    try {
      const formation = await Formation.findById(formationId);
      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      const module = new Module(moduleData);
      formation.modules.push(module);
      await formation.save();

      return formation;
    } catch (error) {
      logger.error(`Erreur lors de l'ajout du module à la formation ${formationId}:`, error);
      throw error;
    }
  }

  async updateModule(formationId: string, moduleId: string, updateData: Partial<ModuleInput>): Promise<IFormation> {
    try {
      const formation = await Formation.findOneAndUpdate(
        { _id: formationId, 'modules._id': moduleId },
        { $set: { 'modules.$': updateData } },
        { new: true }
      ).exec();

      if (!formation) {
        throw new Error('Formation ou module non trouvé');
      }

      return formation;
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
      return await Formation.find(
        { $text: { $search: searchTerm }, status: 'published' },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .populate('instructor', 'name email avatar')
        .exec();
    } catch (error) {
      logger.error('Erreur lors de la recherche de formations:', error);
      throw error;
    }
  }
} 