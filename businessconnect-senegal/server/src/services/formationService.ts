import Formation from '../models/Formation';
import { 
  IFormation, 
  IFormationDocument,
  IFormationCreationDTO,
  IFormationUpdateDTO,
  IFormationStats,
  FormationFilters,
  FormationInput,
  ModuleInput,
  FormationStatus
} from '../types/formation';
import { FilterQuery } from 'mongoose';
import { logger } from '../utils/logger';
import { FormationRequest } from '../types/controllers';
import { Types } from 'mongoose';

export default class FormationService {
  async createFormation(data: FormationInput): Promise<IFormationDocument> {
    const formation = new Formation({
      ...data,
      status: data.status || FormationStatus.DRAFT,
      enrolledStudents: 0,
      rating: 0,
      enrollments: []
    });
    return await formation.save();
  }

  async getFormationById(id: string): Promise<IFormationDocument | null> {
    return await Formation.findById(id).lean();
  }

  async updateFormation(id: string, data: IFormationUpdateDTO, userId: string): Promise<IFormationDocument | null> {
    return await Formation.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async deleteFormation(id: string, userId: string): Promise<boolean> {
    const result = await Formation.findByIdAndDelete(id);
    return result !== null;
  }

  async listFormations(filters: FormationFilters, page: number = 1, limit: number = 10): Promise<{
    formations: IFormationDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: FilterQuery<IFormationDocument> = {};

    if (filters.category) query.category = filters.category;
    if (filters.level) query.level = filters.level;
    if (filters.status) query.status = filters.status;
    if (filters.priceMin !== undefined) query.price = { $gte: filters.priceMin };
    if (filters.priceMax !== undefined) query.price = { ...query.price, $lte: filters.priceMax };
    if (filters.instructorId) query.instructor = filters.instructorId;

    const skip = (page - 1) * limit;
    const [formations, total] = await Promise.all([
      Formation.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Formation.countDocuments(query)
    ]);

    return {
      formations: formations as IFormationDocument[],
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async searchFormations(searchTerm: string, page: number = 1, limit: number = 10): Promise<{
    formations: IFormationDocument[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query = {
      $text: { $search: searchTerm }
    };

    const skip = (page - 1) * limit;
    const [formations, total] = await Promise.all([
      Formation.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ score: { $meta: 'textScore' } }),
      Formation.countDocuments(query)
    ]);

    return {
      formations,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getFormationStats(formationId: string): Promise<IFormationStats> {
    const formation = await Formation.findById(formationId);
    if (!formation) throw new Error('Formation not found');

    return {
      totalEnrollments: formation.enrolledStudents || 0,
      averageRating: formation.rating || 0,
      completionRate: 0, // À implémenter avec le suivi des progrès
      revenue: formation.price * (formation.enrolledStudents || 0),
      studentProgress: [] // À implémenter avec le suivi des progrès
    };
  }

  async incrementViews(formationId: string): Promise<void> {
    await Formation.findByIdAndUpdate(formationId, {
      $inc: { views: 1 }
    });
  }

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
        .lean();

      return formations.map(formation => ({
        ...formation,
        modules: formation.modules.map(module => ({
          ...module,
          description: module.description || ''
        }))
      })) as IFormation[];
    } catch (error) {
      logger.error('Erreur lors de la récupération des formations:', error);
      throw error;
    }
  }

  async getFormation(id: string): Promise<IFormation | null> {
    const formation = await Formation.findById(id);
    return formation ? formation.toObject() : null;
  }

  async addModule(formationId: string, moduleData: ModuleInput): Promise<IFormation> {
    try {
      const formation = await Formation.findById(formationId);
      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      formation.modules.push({
        ...moduleData,
        description: moduleData.description || ''
      });

      const savedFormation = await formation.save();
      return savedFormation.toObject() as IFormation;
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

      return {
        ...formation,
        modules: formation.modules.map(module => ({
          ...module,
          description: module.description || ''
        }))
      } as IFormation;
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
      ).lean();

      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      return {
        ...formation,
        modules: formation.modules.map(module => ({
          ...module,
          description: module.description || ''
        }))
      } as IFormation;
    } catch (error) {
      logger.error(`Erreur lors de la suppression du module ${moduleId}:`, error);
      throw error;
    }
  }

  async enrollStudent(formationId: string, studentId: string): Promise<IFormationDocument> {
    try {
      const formation = await Formation.findByIdAndUpdate(
        formationId,
        { 
          $inc: { enrolledStudents: 1 }
        },
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

  async unenrollStudent(formationId: string, studentId: string): Promise<IFormationDocument> {
    try {
      const formation = await Formation.findByIdAndUpdate(
        formationId,
        { 
          $inc: { enrolledStudents: -1 }
        },
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

  async rateFormation(formationId: string, userId: string, rating: number): Promise<IFormationDocument> {
    try {
      const formation = await Formation.findById(formationId);
      if (!formation) {
        throw new Error('Formation non trouvée');
      }

      formation.rating = ((formation.rating || 0) + rating) / 2;
      await formation.save();
      
      return formation;
    } catch (error) {
      logger.error(`Erreur lors de l'évaluation de la formation ${formationId}:`, error);
      throw error;
    }
  }
} 