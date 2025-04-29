import { Request, Response } from 'express';
import { forumService } from '../services/forumService';
import { logger } from '../utils/logger';

export const forumController = {
  async createDiscussion(req: Request, res: Response) {
    try {
      const { title, content, tags } = req.body;
      const userId = req.user?.id;
      const userName = req.user?.name;

      if (!userId || !userName) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      if (!title || !content) {
        return res.status(400).json({ message: 'Le titre et le contenu sont requis' });
      }

      const discussion = await forumService.createDiscussion({
        title,
        content,
        author: {
          id: userId,
          name: userName,
          avatar: req.user?.avatar
        },
        tags: tags || []
      });

      res.status(201).json(discussion);
    } catch (error) {
      logger.error('Erreur lors de la création de la discussion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async getDiscussion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const discussion = await forumService.getDiscussion(id);

      if (!discussion) {
        return res.status(404).json({ message: 'Discussion non trouvée' });
      }

      res.json(discussion);
    } catch (error) {
      logger.error('Erreur lors de la récupération de la discussion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async getDiscussions(req: Request, res: Response) {
    try {
      const discussions = await forumService.getDiscussions();
      res.json(discussions);
    } catch (error) {
      logger.error('Erreur lors de la récupération des discussions:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async addReply(req: Request, res: Response) {
    try {
      const { discussionId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;
      const userName = req.user?.name;

      if (!userId || !userName) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      if (!content) {
        return res.status(400).json({ message: 'Le contenu est requis' });
      }

      const reply = await forumService.addReply({
        discussionId,
        content,
        author: {
          id: userId,
          name: userName,
          avatar: req.user?.avatar
        }
      });

      res.status(201).json(reply);
    } catch (error) {
      logger.error('Erreur lors de l\'ajout de la réponse:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async likeDiscussion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      const likes = await forumService.likeDiscussion(id, userId);
      res.json({ likes });
    } catch (error) {
      logger.error('Erreur lors du like de la discussion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async reportDiscussion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: 'Non authentifié' });
      }

      await forumService.reportDiscussion(id, userId);
      res.status(204).send();
    } catch (error) {
      logger.error('Erreur lors du signalement de la discussion:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
};