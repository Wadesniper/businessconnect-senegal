// import { Request, Response } from 'express';
type Request = any;
type Response = any;
import { Job } from '../models/job';

export const jobController = {
  async getAllJobs(req: Request, res: Response) {
    try {
      const jobs = await Job.find().sort({ createdAt: -1 });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération des offres d\'emploi' });
    }
  },

  async getJobById(req: Request, res: Response) {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Offre d\'emploi non trouvée' });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la récupération de l\'offre d\'emploi' });
    }
  },

  async createJob(req: Request, res: Response) {
    try {
      const job = new Job({
        ...req.body,
        userId: req.user?.id
      });
      await job.save();
      res.status(201).json(job);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la création de l\'offre d\'emploi' });
    }
  },

  async updateJob(req: Request, res: Response) {
    try {
      const job = await Job.findOneAndUpdate(
        { _id: req.params.id, userId: req.user?.id },
        req.body,
        { new: true }
      );
      if (!job) {
        return res.status(404).json({ message: 'Offre d\'emploi non trouvée ou non autorisée' });
      }
      res.json(job);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'offre d\'emploi' });
    }
  },

  async deleteJob(req: Request, res: Response) {
    try {
      const job = await Job.findOneAndDelete({ 
        _id: req.params.id,
        userId: req.user?.id
      });
      if (!job) {
        return res.status(404).json({ message: 'Offre d\'emploi non trouvée ou non autorisée' });
      }
      res.json({ message: 'Offre d\'emploi supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'offre d\'emploi' });
    }
  }
}; 