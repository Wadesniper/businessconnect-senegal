import express from 'express';
import { body } from 'express-validator';
// import { jobController } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { AuthRequest } from '../types/user';
import { Response } from 'express';
import { createJob } from '../controllers/jobController';
import { Router, Request, NextFunction, RouteHandler } from '../types/express';
import * as jobController from '../controllers/jobController';
import { authenticate } from '../middleware/auth';
import { Job } from '../models/Job';

const router = Router();

// Routes publiques
router.get('/', async (req: Request, res: Response) => {
  await jobController.getAllJobs(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await jobController.getJob(req, res);
});

// Routes authentifiées
router.use(authenticate);

// Route de création d'offre
router.post('/', async (req: AuthRequest, res: Response) => {
  await jobController.createJob(req, res);
});

// Route des catégories
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await Job.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
  }
});

// Routes de gestion des offres
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'offre' });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Offre non trouvée' });
    }
    res.json({ message: 'Offre supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'offre' });
  }
});

// Routes de candidature
router.post('/:id/apply', async (req: AuthRequest, res: Response) => {
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
});

router.get('/applications/:jobId', async (req: AuthRequest, res: Response) => {
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
});

router.put('/applications/:applicationId', async (req: AuthRequest, res: Response) => {
  try {
    // TODO: Implémenter la mise à jour des candidatures
    res.json({ message: 'Candidature mise à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour de la candidature' });
  }
});

export default router; 