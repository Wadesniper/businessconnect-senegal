import Job, { IJob } from '../models/Job';
import { Request, Response } from 'express';

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