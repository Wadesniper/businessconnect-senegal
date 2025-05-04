import { Types } from 'mongoose';
import Formation from '../models/Formation';
import { 
  IFormation,
  IFormationDocument,
  FormationCreationDTO,
  FormationUpdateDTO,
  IFormationStats,
  FormationFilters,
  ModuleInput
} from '../types/formation.types';
import { logger } from '../utils/logger';
import { FormationRequest } from '../types/controllers';

export class FormationService {
  private formatFormation(doc: IFormationDocument): IFormation {
    const formation = doc.toObject();
    return {
      ...formation,
      id: formation._id.toString(),
      instructor: formation.instructor.toString(),
      enrollments: formation.enrollments.map(e => e.toString()),
      reviews: formation.reviews.map(r => ({
        ...r,
        userId: r.userId.toString()
      }))
    };
  }

  async createFormation(data: FormationCreationDTO): Promise<IFormation> {
    const formation = await Formation.create({
      ...data,
      instructor: new Types.ObjectId(data.instructor),
      enrollments: [],
      rating: 0,
      views: 0,
      enrolledStudents: 0,
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

  async listFormations(filters: FormationFilters = {}): Promise<IFormation[]> {
    const query = Formation.find(filters)
      .populate('instructor', 'name email')
      .populate('enrollments', 'name email');

    const formations = await query.exec();
    return formations.map(formation => this.formatFormation(formation));
  }

  async updateFormation(id: string, data: FormationUpdateDTO): Promise<IFormation | null> {
    const updateData = { ...data };
    if (data.instructor) {
      updateData.instructor = new Types.ObjectId(data.instructor);
    }

    const formation = await Formation.findByIdAndUpdate(
      id,
      { $set: updateData },
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
      { 
        $addToSet: { enrollments: new Types.ObjectId(studentId) },
        $inc: { enrolledStudents: 1 }
      },
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
      { 
        $pull: { enrollments: new Types.ObjectId(studentId) },
        $inc: { enrolledStudents: -1 }
      },
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
      .sort({ rating: -1, enrolledStudents: -1 })
      .limit(10)
      .populate('instructor enrollments');

    return formations.map(formation => this.formatFormation(formation));
  }

  async getFormationStats(formationId: string): Promise<IFormationStats> {
    const formation = await Formation.findById(formationId);
    if (!formation) {
      throw new Error('Formation non trouvée');
    }

    return {
      totalEnrollments: formation.enrolledStudents || 0,
      averageRating: formation.rating || 0,
      completionRate: 0,
      revenue: formation.price * (formation.enrolledStudents || 0),
      studentProgress: []
    };
  }

  async incrementViews(formationId: string): Promise<void> {
    await Formation.findByIdAndUpdate(formationId, {
      $inc: { views: 1 }
    });
  }

  async addModule(formationId: string, moduleData: ModuleInput): Promise<IFormation> {
    const formation = await Formation.findByIdAndUpdate(
      formationId,
      {
        $push: {
          syllabus: {
            ...moduleData,
            description: moduleData.description || ''
          }
        }
      },
      { new: true }
    ).populate('instructor enrollments');

    if (!formation) {
      throw new Error('Formation non trouvée');
    }

    return this.formatFormation(formation);
  }

  async updateModule(formationId: string, moduleId: string, updateData: Partial<ModuleInput>): Promise<IFormation> {
    const formation = await Formation.findOneAndUpdate(
      { 
        _id: formationId,
        'syllabus._id': moduleId
      },
      {
        $set: {
          'syllabus.$': {
            ...updateData,
            description: updateData.description || ''
          }
        }
      },
      { new: true }
    ).populate('instructor enrollments');

    if (!formation) {
      throw new Error('Formation ou module non trouvé');
    }

    return this.formatFormation(formation);
  }

  async deleteModule(formationId: string, moduleId: string): Promise<IFormation> {
    const formation = await Formation.findByIdAndUpdate(
      formationId,
      {
        $pull: {
          syllabus: { _id: moduleId }
        }
      },
      { new: true }
    ).populate('instructor enrollments');

    if (!formation) {
      throw new Error('Formation non trouvée');
    }

    return this.formatFormation(formation);
  }
} 