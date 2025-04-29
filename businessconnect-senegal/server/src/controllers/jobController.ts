import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

interface JobData {
  title: string;
  description: string;
  company: string;
  location: string;
  type: 'CDI' | 'CDD' | 'Stage' | 'Freelance';
  salary_range?: string;
  requirements?: string[];
  benefits?: string[];
}

interface User {
  id: string;
  role: string;
  company_id?: string;
}

export const jobController = {
  async getAllJobs(req: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
      return res.json(result.rows);
    } catch (error) {
      logger.error('Erreur lors de la récupération des emplois:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async getJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Emploi non trouvé' });
      }

      return res.json(result.rows[0]);
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'emploi:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async createJob(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = req.user as User;
      const company_id = user?.company_id;

      if (!company_id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const jobData: JobData = req.body;
      const result = await pool.query(
        'INSERT INTO jobs (title, description, company_id, company, location, type, salary_range, requirements, benefits) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [
          jobData.title,
          jobData.description,
          company_id,
          jobData.company,
          jobData.location,
          jobData.type,
          jobData.salary_range,
          jobData.requirements,
          jobData.benefits,
        ]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      logger.error('Erreur lors de la création de l\'emploi:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async updateJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user as User;
      const company_id = user?.company_id;

      if (!company_id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const jobData: Partial<JobData> = req.body;
      const result = await pool.query(
        'UPDATE jobs SET title = $1, description = $2, location = $3, type = $4, salary_range = $5, requirements = $6, benefits = $7 WHERE id = $8 AND company_id = $9 RETURNING *',
        [
          jobData.title,
          jobData.description,
          jobData.location,
          jobData.type,
          jobData.salary_range,
          jobData.requirements,
          jobData.benefits,
          id,
          company_id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Emploi non trouvé ou accès non autorisé' });
      }

      return res.json(result.rows[0]);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'emploi:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = req.user as User;
      const company_id = user?.company_id;

      if (!company_id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const result = await pool.query(
        'DELETE FROM jobs WHERE id = $1 AND company_id = $2 RETURNING *',
        [id, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Emploi non trouvé ou accès non autorisé' });
      }

      return res.json({ message: 'Emploi supprimé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'emploi:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async getCategories(_req: Request, res: Response) {
    try {
      const categories = [
        'Développement',
        'Design',
        'Marketing',
        'Ventes',
        'Finance',
        'Ressources Humaines',
        'Support Client',
        'Gestion de Projet',
        'Autre'
      ];
      return res.json(categories);
    } catch (error) {
      logger.error('Erreur lors de la récupération des catégories:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async applyToJob(req: Request, res: Response) {
    try {
      const { id: job_id } = req.params;
      const user = req.user as User;
      const { cv_url, cover_letter } = req.body;

      const result = await pool.query(
        'INSERT INTO job_applications (job_id, user_id, cv_url, cover_letter) VALUES ($1, $2, $3, $4) RETURNING *',
        [job_id, user.id, cv_url, cover_letter]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error) {
      logger.error('Erreur lors de la candidature:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async getJobApplications(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const user = req.user as User;
      const company_id = user?.company_id;

      if (!company_id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const result = await pool.query(
        'SELECT ja.*, u.name, u.email FROM job_applications ja INNER JOIN users u ON ja.user_id = u.id WHERE ja.job_id = $1 AND jobs.company_id = $2',
        [jobId, company_id]
      );

      return res.json(result.rows);
    } catch (error) {
      logger.error('Erreur lors de la récupération des candidatures:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  },

  async updateApplicationStatus(req: Request, res: Response) {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;
      const user = req.user as User;
      const company_id = user?.company_id;

      if (!company_id) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const result = await pool.query(
        'UPDATE job_applications SET status = $1 WHERE id = $2 AND job_id IN (SELECT id FROM jobs WHERE company_id = $3) RETURNING *',
        [status, applicationId, company_id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Candidature non trouvée ou accès non autorisé' });
      }

      return res.json(result.rows[0]);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut de la candidature:', error);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
  }
}; 