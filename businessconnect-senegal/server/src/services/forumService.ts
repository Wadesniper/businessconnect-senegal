import { Topic, Post, Report, Comment } from '../models/forum';
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

  async getAllPosts() {
    try {
      return await Post.find()
        .sort({ createdAt: -1 })
        .populate('userId', 'name avatar')
        .lean();
    } catch (error) {
      logger.error('Erreur lors de la récupération des posts:', error);
      throw error;
    }
  }

  async getPostById(id: string) {
    try {
      return await Post.findById(id)
        .populate('userId', 'name avatar')
        .populate({
          path: 'comments',
          populate: { path: 'userId', select: 'name avatar' }
        })
        .lean();
    } catch (error) {
      logger.error('Erreur lors de la récupération du post:', error);
      throw error;
    }
  }

  async createPost(data: {
    title: string;
    content: string;
    category: string;
    userId: string;
  }) {
    try {
      const post = new Post(data);
      await post.save();
      return post.toObject();
    } catch (error) {
      logger.error('Erreur lors de la création du post:', error);
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
      if (result.deletedCount === 0) return false;

      // Supprimer tous les commentaires associés
      await Comment.deleteMany({ postId: id });
      return true;
    } catch (error) {
      logger.error('Erreur lors de la suppression du post:', error);
      throw error;
    }
  }

  async updatePost(id: string, userId: string, data: Partial<{
    title: string;
    content: string;
    category: string;
  }>) {
    try {
      const post = await Post.findOne({ _id: id, userId });
      if (!post) return null;

      Object.assign(post, data);
      await post.save();
      return post.toObject();
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du post:', error);
      throw error;
    }
  }

  async likePost(id: string, userId: string) {
    try {
      const post = await Post.findById(id);
      if (!post) return null;

      const hasLiked = post.likes.includes(userId);
      if (hasLiked) {
        post.likes = post.likes.filter(id => id.toString() !== userId);
      } else {
        post.likes.push(userId);
        // Notifier l'auteur du post
        if (post.userId.toString() !== userId) {
          await this.notificationService.sendPostLikeNotification(
            post.userId.toString(),
            post._id.toString()
          );
        }
      }

      await post.save();
      return post.toObject();
    } catch (error) {
      logger.error('Erreur lors du like/unlike du post:', error);
      throw error;
    }
  }

  async addComment(postId: string, userId: string, content: string) {
    try {
      const comment = new Comment({
        postId,
        userId,
        content
      });
      await comment.save();

      const post = await Post.findById(postId);
      if (post && post.userId.toString() !== userId) {
        await this.notificationService.sendNewCommentNotification(
          post.userId.toString(),
          post._id.toString()
        );
      }

      return comment.toObject();
    } catch (error) {
      logger.error('Erreur lors de l\'ajout du commentaire:', error);
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
      logger.error('Erreur lors du signalement du post:', error);
      throw error;
    }
  }
} 