import { Topic, Post, Report } from '../models/forum';
import { logger } from '../utils/logger';
import { NotificationService } from './notificationService';

export class ForumService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService({ daysBeforeExpiration: [] });
  }

  async getAllTopics() {
    try {
      return await Topic.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'name avatar')
        .lean();
    } catch (error) {
      logger.error('Erreur lors de la récupération des sujets:', error);
      throw error;
    }
  }

  async getTopicById(id: string) {
    try {
      return await Topic.findById(id)
        .populate('userId', 'name avatar')
        .lean();
    } catch (error) {
      logger.error('Erreur lors de la récupération du sujet:', error);
      throw error;
    }
  }

  async getPostsByTopic(topicId: string) {
    try {
      return await Post.find({ topicId })
        .sort({ createdAt: 1 })
        .populate('userId', 'name avatar')
        .lean();
    } catch (error) {
      logger.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }
  }

  async createTopic(data: {
    title: string;
    description: string;
    category: string;
    userId: string;
  }) {
    try {
      const topic = new Topic(data);
      await topic.save();
      return topic.toObject();
    } catch (error) {
      logger.error('Erreur lors de la création du sujet:', error);
      throw error;
    }
  }

  async createPost(data: {
    content: string;
    topicId: string;
    userId: string;
  }) {
    try {
      const post = new Post(data);
      await post.save();

      // Notifier l'auteur du sujet
      const topic = await Topic.findById(data.topicId);
      if (topic && topic.userId.toString() !== data.userId) {
        await this.notificationService.sendNewPostNotification(
          topic.userId.toString(),
          topic.title
        );
      }

      return post.toObject();
    } catch (error) {
      logger.error('Erreur lors de la création du message:', error);
      throw error;
    }
  }

  async updateTopic(id: string, userId: string, data: Partial<{
    title: string;
    description: string;
  }>) {
    try {
      const topic = await Topic.findOne({ _id: id, userId });
      if (!topic) return null;

      Object.assign(topic, data);
      await topic.save();
      return topic.toObject();
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du sujet:', error);
      throw error;
    }
  }

  async deleteTopic(id: string, userId: string) {
    try {
      const result = await Topic.deleteOne({ _id: id, userId });
      if (result.deletedCount === 0) return false;

      // Supprimer tous les messages associés
      await Post.deleteMany({ topicId: id });
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression du sujet:', error);
      throw error;
    }
  }

  async deletePost(id: string, userId: string) {
    try {
      const result = await Post.deleteOne({ _id: id, userId });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error('Erreur lors de la suppression du message:', error);
      throw error;
    }
  }

  async reportTopic(topicId: string, userId: string, reason: string) {
    try {
      const report = new Report({
        type: 'topic',
        targetId: topicId,
        userId,
        reason
      });
      await report.save();

      // Notifier les modérateurs
      await this.notificationService.sendTopicReportNotification(topicId);
    } catch (error) {
      logger.error('Erreur lors du signalement du sujet:', error);
      throw error;
    }
  }

  async reportPost(postId: string, userId: string, reason: string) {
    try {
      const report = new Report({
        type: 'post',
        targetId: postId,
        userId,
        reason
      });
      await report.save();

      // Notifier les modérateurs
      await this.notificationService.sendPostReportNotification(postId);
    } catch (error) {
      logger.error('Erreur lors du signalement du message:', error);
      throw error;
    }
  }
} 