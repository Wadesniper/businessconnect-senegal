import { Job } from '../models/Job';
import { Request, Response } from 'express';

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
  }
}; 