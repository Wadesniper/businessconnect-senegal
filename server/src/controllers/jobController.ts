import { Request, Response } from '../types/express';
import { Job } from '../models/Job';
import { logger } from '../utils/logger';

export async function getAllJobs(req: Request, res: Response) {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    logger.error('Erreur lors de la récupération des jobs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des jobs' });
  }
}

export async function getJob(req: Request, res: Response) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job non trouvé' });
    }
    res.json(job);
  } catch (error) {
    logger.error('Erreur lors de la récupération du job:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du job' });
  }
}

export async function createJob(req: Request, res: Response) {
  try {
    const job = new Job({
      ...req.body,
      createdBy: req.user?.id
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    logger.error('Erreur lors de la création du job:', error);
    res.status(500).json({ error: 'Erreur lors de la création du job' });
  }
}

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Job.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'offre' });
  }
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }
    res.json({ message: 'Offre supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'offre' });
  }
};

export const applyForJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }
    // TODO: Implémenter la logique de candidature
    res.json({ message: 'Candidature envoyée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi de la candidature' });
  }
};

export const getApplications = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }
    // TODO: Implémenter la récupération des candidatures
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des candidatures' });
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