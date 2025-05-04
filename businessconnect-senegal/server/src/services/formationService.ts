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
  async createFormation(data: IFormationCreationDTO): Promise<IFormation> {
    const formation = await Formation.create({
      ...data,
      enrollments: [],
      rating: 0,
      reviews: []
    });
    
    return this.formatFormation(formation);
  }

  async getFormation(id: string): Promise<IFormation | null> {
    const formation = await Formation.findById(id)
      .populate('instructor', 'name email')
      .populate('enrollments', 'name email');
    
    return formation ? this.formatFormation(formation) : null;
  }

  async listFormations(filters: {
    category?: string;
    level?: string;
    language?: string;
    instructor?: string;
    status?: string;
  } = {}): Promise<IFormation[]> {
    const query = Formation.find(filters)
      .populate('instructor', 'name email')
      .populate('enrollments', 'name email');

    const formations = await query.exec();
    return formations.map(formation => this.formatFormation(formation));
  }

  async updateFormation(id: string, data: IFormationUpdateDTO): Promise<IFormation | null> {
    const formation = await Formation.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).populate('instructor enrollments');

    return formation ? this.formatFormation(formation) : null;
  }

  async deleteFormation(id: string): Promise<boolean> {
    const result = await Formation.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async enrollStudent(formationId: string, studentId: string): Promise<IFormation> {
    const formation = await Formation.findByIdAndUpdate(
      formationId,
      { $addToSet: { enrollments: new Types.ObjectId(studentId) } },
      { new: true }
    ).populate('instructor enrollments');

    if (!formation) {
      throw new Error('Formation non trouvée');
    }

    return this.formatFormation(formation);
  }

  async unenrollStudent(formationId: string, studentId: string): Promise<IFormation> {
    const formation = await Formation.findByIdAndUpdate(
      formationId,
      { $pull: { enrollments: new Types.ObjectId(studentId) } },
      { new: true }
    ).populate('instructor enrollments');

    if (!formation) {
      throw new Error('Formation non trouvée');
    }

    return this.formatFormation(formation);
  }

  async searchFormations(query: string): Promise<IFormation[]> {
    const formations = await Formation.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).populate('instructor enrollments');

    return formations.map(formation => this.formatFormation(formation));
  }

  async getPopularFormations(): Promise<IFormation[]> {
    const formations = await Formation.find({ status: 'published' })
      .sort({ rating: -1, 'enrollments.length': -1 })
      .limit(10)
      .populate('instructor enrollments');

    return formations.map(formation => this.formatFormation(formation));
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

  private formatFormation(doc: any): IFormation {
    const formation = doc.toObject();
    return {
      ...formation,
      id: formation._id.toString(),
      instructor: formation.instructor?._id || formation.instructor,
      enrollments: (formation.enrollments || []).map((e: any) => 
        typeof e === 'object' ? e._id : e
      )
    };
  }
} 