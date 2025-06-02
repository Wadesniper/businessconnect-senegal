import Job, { IJob } from '../models/Job';
import { Request, Response } from '../types/express';

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id) as IJob | null;
    if (!job) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }
    const jobObj = job.toObject();
    res.json({
      ...jobObj,
      email: jobObj.contactEmail,
      phone: jobObj.contactPhone
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'offre' });
  }
};

export const createJob = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Non autorisé' });
    }
    const jobData = { ...req.body, createdBy: userId };
    const job = new Job(jobData);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création de l\'offre' });
  }
};

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