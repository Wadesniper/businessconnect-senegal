import { logger } from '../utils/logger';

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  replies: Reply[];
  tags: string[];
}

export interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  likes: number;
}

class ForumService {
  private discussions: Map<string, Discussion>;

  constructor() {
    this.discussions = new Map();
    this.initializeDiscussions();
  }

  private initializeDiscussions() {
    const initialDiscussions: Discussion[] = [
      {
        id: '1',
        title: 'Conseils pour trouver un stage en développement web à Dakar',
        content: 'Bonjour à tous ! Je suis étudiante en informatique et je cherche un stage en développement web. Quelles sont les entreprises à Dakar qui recrutent régulièrement des stagiaires ? Avez-vous des conseils pour se démarquer ?',
        author: {
          id: 'user1',
          name: 'Aminata Diallo',
        },
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15'),
        likes: 12,
        replies: [
          {
            id: 'reply1',
            content: 'Je recommande de postuler chez Gainde 2000, ils ont souvent des opportunités pour les stagiaires.',
            author: {
              id: 'user2',
              name: 'Moussa Sow',
            },
            createdAt: new Date('2024-02-16'),
            likes: 5
          }
        ],
        tags: ['stage', 'développement web', 'conseils']
      },
      {
        id: '2',
        title: 'Formation en Data Science à distance',
        content: 'Je cherche des recommandations pour une bonne formation en Data Science que je peux suivre à distance. Budget maximum de 500 000 FCFA.',
        author: {
          id: 'user3',
          name: 'Fatou Ndiaye',
        },
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-02'),
        likes: 8,
        replies: [
          {
            id: 'reply2',
            content: 'DataCamp est une excellente plateforme pour débuter, avec des prix abordables.',
            author: {
              id: 'user4',
              name: 'Ibrahima Diop',
            },
            createdAt: new Date('2024-03-02'),
            likes: 3
          }
        ],
        tags: ['formation', 'data science', 'apprentissage en ligne']
      },
      {
        id: '3',
        title: 'Création d\'une startup dans l\'agritech',
        content: 'Je souhaite lancer une startup dans l\'agritech au Sénégal. Je recherche des développeurs passionnés par l\'agriculture pour rejoindre l\'aventure.',
        author: {
          id: 'user5',
          name: 'Ousmane Fall',
        },
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10'),
        likes: 15,
        replies: [],
        tags: ['startup', 'agritech', 'entrepreneuriat']
      }
    ];

    initialDiscussions.forEach(discussion => {
      this.discussions.set(discussion.id, discussion);
    });
  }

  async createDiscussion(params: { title: string; content: string; author: { id: string; name: string; avatar?: string }; tags: string[] }): Promise<Discussion> {
    try {
      const discussion: Discussion = {
        id: Date.now().toString(),
        title: params.title,
        content: params.content,
        author: params.author,
        createdAt: new Date(),
        updatedAt: new Date(),
        likes: 0,
        replies: [],
        tags: params.tags
      };

      this.discussions.set(discussion.id, discussion);
      logger.info(`Discussion créée avec succès: ${discussion.id}`);
      return discussion;
    } catch (error) {
      logger.error('Erreur lors de la création de la discussion:', error);
      throw error;
    }
  }

  async getDiscussion(id: string): Promise<Discussion | null> {
    try {
      const discussion = this.discussions.get(id);
      if (!discussion) {
        logger.warn(`Discussion non trouvée: ${id}`);
        return null;
      }
      return discussion;
    } catch (error) {
      logger.error('Erreur lors de la récupération de la discussion:', error);
      throw error;
    }
  }

  async getDiscussions(): Promise<Discussion[]> {
    try {
      return Array.from(this.discussions.values());
    } catch (error) {
      logger.error('Erreur lors de la récupération des discussions:', error);
      throw error;
    }
  }

  async addReply(params: { discussionId: string; content: string; author: { id: string; name: string; avatar?: string } }): Promise<Reply> {
    try {
      const discussion = this.discussions.get(params.discussionId);
      if (!discussion) {
        throw new Error('Discussion non trouvée');
      }

      const reply: Reply = {
        id: Date.now().toString(),
        content: params.content,
        author: params.author,
        createdAt: new Date(),
        likes: 0
      };

      discussion.replies.push(reply);
      discussion.updatedAt = new Date();
      this.discussions.set(params.discussionId, discussion);

      logger.info(`Réponse ajoutée avec succès à la discussion: ${params.discussionId}`);
      return reply;
    } catch (error) {
      logger.error('Erreur lors de l\'ajout de la réponse:', error);
      throw error;
    }
  }

  async likeDiscussion(discussionId: string, userId: string): Promise<number> {
    try {
      const discussion = this.discussions.get(discussionId);
      if (!discussion) {
        throw new Error('Discussion non trouvée');
      }

      discussion.likes++;
      this.discussions.set(discussionId, discussion);

      logger.info(`Discussion likée avec succès: ${discussionId} par l'utilisateur: ${userId}`);
      return discussion.likes;
    } catch (error) {
      logger.error('Erreur lors du like de la discussion:', error);
      throw error;
    }
  }

  async reportDiscussion(discussionId: string, userId: string): Promise<void> {
    try {
      const discussion = this.discussions.get(discussionId);
      if (!discussion) {
        throw new Error('Discussion non trouvée');
      }

      logger.info(`Discussion signalée: ${discussionId} par l'utilisateur: ${userId}`);
    } catch (error) {
      logger.error('Erreur lors du signalement de la discussion:', error);
      throw error;
    }
  }
}

export const forumService = new ForumService(); 