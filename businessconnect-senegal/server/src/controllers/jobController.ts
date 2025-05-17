import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import pool from '../config/database';
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

export const jobController = {
  async getAllJobs(_: Request, res: Response) {
    try {
      const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
      res.json(result.rows);
      return;
    } catch (error) {
      logger.error('Erreur lors de la récupération des emplois:', error);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
  },

  async getJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Emploi non trouvé' });
        return;
      }

      res.json(result.rows[0]);
      return;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'emploi:', error);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
  },

  async createJob(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const jobData: JobData = req.body;
      const result = await pool.query(
        'INSERT INTO jobs (title, description, company, location, type, salary_range, requirements, benefits) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [
          jobData.title,
          jobData.description,
          jobData.company,
          jobData.location,
          jobData.type,
          jobData.salary_range,
          jobData.requirements,
          jobData.benefits,
        ]
      );

      res.status(201).json(result.rows[0]);
      return;
    } catch (error) {
      logger.error('Erreur lors de la création de l\'emploi:', error);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
  },

  async updateJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const jobData: Partial<JobData> = req.body;
      const result = await pool.query(
        'UPDATE jobs SET title = $1, description = $2, location = $3, type = $4, salary_range = $5, requirements = $6, benefits = $7 WHERE id = $8 RETURNING *',
        [
          jobData.title,
          jobData.description,
          jobData.location,
          jobData.type,
          jobData.salary_range,
          jobData.requirements,
          jobData.benefits,
          id,
        ]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Emploi non trouvé' });
        return;
      }

      res.json(result.rows[0]);
      return;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'emploi:', error);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
  },

  async deleteJob(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'DELETE FROM jobs WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Emploi non trouvé' });
        return;
      }

      res.json({ message: 'Emploi supprimé avec succès' });
      return;
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'emploi:', error);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
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
      res.json(categories);
      return;
    } catch (error) {
      logger.error('Erreur lors de la récupération des catégories:', error);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
  },

  async applyToJob(req: Request, res: Response) {
    try {
      const { id: job_id } = req.params;
      const { cv_url, cover_letter } = req.body;

      const result = await pool.query(
        'INSERT INTO job_applications (job_id, cv_url, cover_letter) VALUES ($1, $2, $3) RETURNING *',
        [job_id, cv_url, cover_letter]
      );

      res.status(201).json(result.rows[0]);
      return;
    } catch (error) {
      logger.error('Erreur lors de la candidature:', error);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
  },

  async getJobApplications(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      const result = await pool.query(
        'SELECT ja.*, u.name, u.email FROM job_applications ja INNER JOIN users u ON ja.user_id = u.id WHERE ja.job_id = $1',
        [jobId]
      );

      res.json(result.rows);
      return;
    } catch (error) {
      logger.error('Erreur lors de la récupération des candidatures:', error);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
  },

  async updateApplicationStatus(req: Request, res: Response) {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;
      const result = await pool.query(
        'UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *',
        [status, applicationId]
      );

      if (result.rows.length === 0) {
        res.status(404).json({ error: 'Candidature non trouvée' });
        return;
      }

      res.json(result.rows[0]);
      return;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut de la candidature:', error);
      res.status(500).json({ error: 'Erreur serveur' });
      return;
    }
  },

  async searchJobs(_: Request, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Recherche d\'emplois non implémentée.'
    });
  },

  async getEmployerJobs(_: Request, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Récupération des emplois employeur non implémentée.'
    });
  },

  async getCandidateApplications(_: Request, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Récupération des candidatures non implémentée.'
    });
  },

  async getSavedJobs(_: Request, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Récupération des emplois sauvegardés non implémentée.'
    });
  },

  async toggleSaveJob(_: Request, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Sauvegarde d\'emploi non implémentée.'
    });
  }
}; 