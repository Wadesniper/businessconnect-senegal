import { Request, Response } from 'express';
import { ForumService } from '../services/forumService';
import { logger } from '../utils/logger';

export class ForumController {
  private forumService: ForumService;

  constructor() {
    this.forumService = new ForumService();
  }

  getAllTopics = async (req: Request, res: Response) => {
    try {
      const topics = await this.forumService.getAllTopics();
      res.status(200).json({ success: true, data: topics });
    } catch (error) {
      logger.error('Erreur lors de la récupération des sujets:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  getTopicById = async (req: Request, res: Response) => {
    try {
      const topic = await this.forumService.getTopicById(req.params.id);
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Sujet non trouvé' });
      }
      res.status(200).json({ success: true, data: topic });
    } catch (error) {
      logger.error('Erreur lors de la récupération du sujet:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  getPostsByTopic = async (req: Request, res: Response) => {
    try {
      const posts = await this.forumService.getPostsByTopic(req.params.id);
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      logger.error('Erreur lors de la récupération des messages:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  createTopic = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const topic = await this.forumService.createTopic({
        ...req.body,
        userId
      });
      res.status(201).json({ success: true, data: topic });
    } catch (error) {
      logger.error('Erreur lors de la création du sujet:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts = await this.forumService.getAllPosts();
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      logger.error('Erreur lors de la récupération des posts:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  getPostById = async (req: Request, res: Response) => {
    try {
      const post = await this.forumService.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post non trouvé' });
      }
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      logger.error('Erreur lors de la récupération du post:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  createPost = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const post = await this.forumService.createPost({
        ...req.body,
        userId
      });
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      logger.error('Erreur lors de la création du post:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  updateTopic = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const topic = await this.forumService.updateTopic(req.params.id, userId, req.body);
      if (!topic) {
        return res.status(404).json({ success: false, message: 'Sujet non trouvé' });
      }
      res.status(200).json({ success: true, data: topic });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du sujet:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  deleteTopic = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const success = await this.forumService.deleteTopic(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Sujet non trouvé' });
      }
      res.status(200).json({ success: true, message: 'Sujet supprimé' });
    } catch (error) {
      logger.error('Erreur lors de la suppression du sujet:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  updatePost = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const post = await this.forumService.updatePost(req.params.id, userId, req.body);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post non trouvé' });
      }
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du post:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  deletePost = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const success = await this.forumService.deletePost(req.params.id, userId);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Post non trouvé' });
      }
      res.status(200).json({ success: true, message: 'Post supprimé' });
    } catch (error) {
      logger.error('Erreur lors de la suppression du post:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  likePost = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const post = await this.forumService.likePost(req.params.id, userId);
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post non trouvé' });
      }
      res.status(200).json({ success: true, data: post });
    } catch (error) {
      logger.error('Erreur lors du like du post:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  addComment = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      const comment = await this.forumService.addComment(req.params.id, userId, req.body.content);
      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      logger.error('Erreur lors de l\'ajout du commentaire:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  reportTopic = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      await this.forumService.reportTopic(req.params.id, userId, req.body.reason);
      res.status(200).json({ success: true, message: 'Signalement enregistré' });
    } catch (error) {
      logger.error('Erreur lors du signalement du sujet:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };

  reportPost = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non autorisé' });
      }

      await this.forumService.reportPost(req.params.id, userId, req.body.reason);
      res.status(200).json({ success: true, message: 'Signalement enregistré' });
    } catch (error) {
      logger.error('Erreur lors du signalement du post:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur' });
    }
  };
}