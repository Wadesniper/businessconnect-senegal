import { Request, Response } from '../types/express';
import { Job } from '../models/Job';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

class JobController {
  async getAllJobs(req: Request, res: Response) {
    try {
      const jobs = await Job.find().sort({ createdAt: -1 });
      res.json(jobs);
    } catch (error) {
      logger.error('Erreur lors de la récupération des offres:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
    }
  }

  async getJobById(req: Request, res: Response) {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: 'Offre non trouvée' });
      }
      res.json(job);
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'offre:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'offre' });
    }
  }

  async searchJobs(req: Request, res: Response) {
    try {
      const { query } = req.query;
      const jobs = await Job.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      });
      res.json(jobs);
    } catch (error) {
      logger.error('Erreur lors de la recherche des offres:', error);
      res.status(500).json({ error: 'Erreur lors de la recherche des offres' });
    }
  }

  async createJob(req: Request, res: Response) {
    try {
      const job = await Job.create({
        ...req.body,
        postedBy: new Types.ObjectId(req.user?.id)
      });
      res.status(201).json(job);
    } catch (error) {
      logger.error('Erreur lors de la création de l\'offre:', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'offre' });
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const job = await Job.findOneAndUpdate(
        { 
          _id: req.params.id, 
          postedBy: new Types.ObjectId(req.user?.id)
        },
        req.body,
        { new: true }
      );
      if (!job) {
        return res.status(404).json({ error: 'Offre non trouvée' });
      }
      res.json(job);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'offre:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'offre' });
    }
  }

  async deleteJob(req: Request, res: Response) {
    try {
      const job = await Job.findOneAndDelete({
        _id: req.params.id,
        postedBy: new Types.ObjectId(req.user?.id)
      });
      if (!job) {
        return res.status(404).json({ error: 'Offre non trouvée' });
      }
      res.json({ message: 'Offre supprimée avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'offre:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'offre' });
    }
  }

  async applyForJob(req: Request, res: Response) {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: 'Offre non trouvée' });
      }

      const alreadyApplied = job.applications.some(
        app => app.applicant.toString() === req.user?.id
      );
      if (alreadyApplied) {
        return res.status(400).json({ error: 'Vous avez déjà postulé à cette offre' });
      }

      job.applications.push({
        applicant: new Types.ObjectId(req.user?.id),
        status: 'pending',
        appliedAt: new Date()
      });
      await job.save();

      res.json({ message: 'Candidature envoyée avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la candidature:', error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi de la candidature' });
    }
  }

  async getMyApplications(req: Request, res: Response) {
    try {
      const jobs = await Job.find({
        'applications.applicant': new Types.ObjectId(req.user?.id)
      });
      res.json(jobs);
    } catch (error) {
      logger.error('Erreur lors de la récupération des candidatures:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des candidatures' });
    }
  }

  async getJobApplications(req: Request, res: Response) {
    try {
      const job = await Job.findOne({
        _id: req.params.id,
        postedBy: new Types.ObjectId(req.user?.id)
      }).populate('applications.applicant', 'firstName lastName email');
      
      if (!job) {
        return res.status(404).json({ error: 'Offre non trouvée' });
      }
      
      res.json(job.applications);
    } catch (error) {
      logger.error('Erreur lors de la récupération des candidatures:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des candidatures' });
    }
  }

  async updateApplicationStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const job = await Job.findOneAndUpdate(
        {
          _id: req.params.id,
          postedBy: new Types.ObjectId(req.user?.id),
          'applications._id': req.params.applicationId
        },
        {
          $set: {
            'applications.$.status': status
          }
        },
        { new: true }
      );

      if (!job) {
        return res.status(404).json({ error: 'Candidature non trouvée' });
      }

      res.json({ message: 'Statut de la candidature mis à jour' });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
  }
}

export const jobController = new JobController();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Job.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    // TODO: Implémenter la mise à jour des candidatures
    res.json({ message: 'Candidature mise à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la candidature' });
  }
}; 