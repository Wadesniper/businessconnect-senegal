import { Request, Response } from 'express';
import Job, { IJob } from '../models/Job';
import { logger } from '../utils/logger';

// Créer une nouvelle offre
export const createJob = async (req: Request, res: Response) => {
  try {
    const jobData = {
      ...req.body,
      employerId: req.user?._id
    };

    const job = await Job.create(jobData);
    logger.info(`Nouvelle offre créée: ${job._id}`);
    
    res.status(201).json(job);
  } catch (error) {
    logger.error('Erreur lors de la création de l\'offre:', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'offre' });
  }
};

// Récupérer toutes les offres actives
export const getJobs = async (req: Request, res: Response) => {
  try {
    const { sector, jobType, search } = req.query;
    
    const query: any = { isActive: true };
    
    if (sector) query.sector = sector;
    if (jobType) query.jobType = jobType;
    if (search) {
      query.$text = { $search: search as string };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    logger.error('Erreur lors de la récupération des offres:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des offres' });
  }
};

// Récupérer une offre par son ID
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }
    res.json(job);
  } catch (error) {
    logger.error('Erreur lors de la récupération de l\'offre:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'offre' });
  }
};

// Mettre à jour une offre
export const updateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Vérifier si l'utilisateur est autorisé à modifier l'offre
    if (job.employerId?.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à modifier cette offre' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    logger.info(`Offre mise à jour: ${req.params.id}`);
    res.json(updatedJob);
  } catch (error) {
    logger.error('Erreur lors de la mise à jour de l\'offre:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'offre' });
  }
};

// Supprimer une offre
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Vérifier si l'utilisateur est autorisé à supprimer l'offre
    if (job.employerId?.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à supprimer cette offre' });
    }

    await job.remove();
    logger.info(`Offre supprimée: ${req.params.id}`);
    res.json({ message: 'Offre supprimée avec succès' });
  } catch (error) {
    logger.error('Erreur lors de la suppression de l\'offre:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'offre' });
  }
};

// Désactiver une offre
export const deactivateJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Offre non trouvée' });
    }

    // Vérifier si l'utilisateur est autorisé à désactiver l'offre
    if (job.employerId?.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé à désactiver cette offre' });
    }

    job.isActive = false;
    await job.save();
    
    logger.info(`Offre désactivée: ${req.params.id}`);
    res.json({ message: 'Offre désactivée avec succès' });
  } catch (error) {
    logger.error('Erreur lors de la désactivation de l\'offre:', error);
    res.status(500).json({ message: 'Erreur lors de la désactivation de l\'offre' });
  }
}; 