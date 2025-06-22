import { Request, Response } from '../types/custom.express.js';
import { logger } from '../utils/logger.js';
import prisma from '../config/prisma.js';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

class JobController {
  async getAllJobs(req: Request, res: Response) {
    const { 
      page = '1', 
      limit = '10', 
      search = '', 
      sector, 
      type, 
      location 
    } = req.query as { [key: string]: string };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    try {
      const where: any = {};
      const filters = [];

      if (search) {
        filters.push({
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ]
        });
      }
      if (sector) filters.push({ sector: { equals: sector } });
      if (type) filters.push({ type: { equals: type } });
      if (location) filters.push({ location: { contains: location, mode: 'insensitive' } });

      if (filters.length > 0) {
        where.AND = filters;
      }
      
      const jobs = await prisma.job.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.job.count({ where });

      res.json({ jobs, total, page: pageNum, limit: limitNum });
    } catch (error) {
      logger.error('Erreur lors de la récupération des offres:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des offres' });
    }
  }

  async getJobById(req: Request, res: Response) {
    try {
      const job = await prisma.job.findUnique({
        where: { id: req.params.id }
      });
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
      const jobs = await prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query as string, mode: 'insensitive' } },
            { description: { contains: query as string, mode: 'insensitive' } }
          ]
        }
      });
      res.json(jobs);
    } catch (error) {
      logger.error('Erreur lors de la recherche des offres:', error);
      res.status(500).json({ error: 'Erreur lors de la recherche des offres' });
    }
  }

  async createJob(req: Request, res: Response) {
    try {
      const { salary_min, salary_max, ...restOfBody } = req.body;
      const job = await prisma.job.create({
        data: {
          ...restOfBody,
          salary_min: salary_min ? parseFloat(salary_min) : undefined,
          salary_max: salary_max ? parseFloat(salary_max) : undefined,
          postedById: req.user?.id
        }
      });
      res.status(201).json(job);
    } catch (error) {
      logger.error('Erreur lors de la création de l\'offre:', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'offre' });
    }
  }

  async updateJob(req: Request, res: Response) {
    try {
      const { salary_min, salary_max, ...restOfBody } = req.body;
      const job = await prisma.job.update({
        where: {
          id: req.params.id,
          postedById: req.user?.id
        },
        data: {
          ...restOfBody,
          salary_min: salary_min ? parseFloat(salary_min) : undefined,
          salary_max: salary_max ? parseFloat(salary_max) : undefined,
        }
      });
      res.json(job);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ error: 'Offre non trouvée' });
      }
      logger.error('Erreur lors de la mise à jour de l\'offre:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'offre' });
    }
  }

  async deleteJob(req: Request, res: Response) {
    try {
      await prisma.job.delete({
        where: {
          id: req.params.id,
          postedById: req.user?.id
        }
      });
      res.json({ message: 'Offre supprimée avec succès' });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return res.status(404).json({ error: 'Offre non trouvée' });
      }
      logger.error('Erreur lors de la suppression de l\'offre:', error);
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'offre' });
    }
  }

  async applyForJob(req: Request, res: Response) {
    try {
      const job = await prisma.job.findUnique({
        where: { id: req.params.id },
        include: { applications: true }
      });

      if (!job) {
        return res.status(404).json({ error: 'Offre non trouvée' });
      }

      const alreadyApplied = job.applications.some(
        app => app.applicantId === req.user?.id
      );

      if (alreadyApplied) {
        return res.status(400).json({ error: 'Vous avez déjà postulé à cette offre' });
      }

      const updatedJob = await prisma.job.update({
        where: { id: req.params.id },
        data: {
          applications: {
            create: {
              applicantId: req.user?.id as string,
              status: 'pending',
              appliedAt: new Date()
            }
          }
        },
        include: { applications: true }
      });

      res.json({ message: 'Candidature envoyée avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la candidature:', error);
      res.status(500).json({ error: 'Erreur lors de l\'envoi de la candidature' });
    }
  }

  async getMyApplications(req: Request, res: Response) {
    try {
      const jobs = await prisma.job.findMany({
        where: {
          applications: {
            some: {
              applicantId: req.user?.id
            }
          }
        },
        include: { applications: true }
      });
      res.json(jobs);
    } catch (error) {
      logger.error('Erreur lors de la récupération des candidatures:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des candidatures' });
    }
  }

  async getJobApplications(req: Request, res: Response) {
    try {
      const job = await prisma.job.findFirst({
        where: {
          id: req.params.id,
          postedById: req.user?.id
        },
        include: {
          applications: {
            include: {
              applicant: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });
      
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
      const job = await prisma.job.update({
        where: {
          id: req.params.id,
          postedById: req.user?.id
        },
        data: {
          applications: {
            update: {
              where: { id: req.params.applicationId },
              data: { status }
            }
          }
        }
      });

      if (!job) {
        return res.status(404).json({ error: 'Candidature non trouvée' });
      }

      res.json({ message: 'Statut de la candidature mis à jour' });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
  }

  async getMyJobs(req: Request, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const jobs = await prisma.job.findMany({
        where: {
          postedById: req.user.id
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json(jobs);
    } catch (error) {
      logger.error('Erreur lors de la récupération de mes offres:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}

export const jobController = new JobController();

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.job.findMany({
      select: { type: true },
      distinct: ['type']
    });
    res.json(categories.map(c => c.type).filter(Boolean));
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