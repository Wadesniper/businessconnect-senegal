import { logger } from '../utils/logger.js';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'etudiant' | 'annonceur' | 'recruteur' | 'admin';
}

export class UserService {
  private users: Map<string, User> = new Map();

  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = this.users.get(userId);
      return user || null;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'utilisateur', { userId, error });
      throw new Error('Échec de la récupération de l\'utilisateur');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = Array.from(this.users.values());
      return users.find(user => user.email === email) || null;
    } catch (error) {
      logger.error('Erreur lors de la recherche de l\'utilisateur par email', { email, error });
      throw new Error('Échec de la recherche de l\'utilisateur');
    }
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const id = this.generateUserId();
      const user: User = {
        id,
        ...userData
      };

      this.users.set(id, user);
      logger.info('Utilisateur créé avec succès', { userId: id });
      return user;
    } catch (error) {
      logger.error('Erreur lors de la création de l\'utilisateur', { error });
      throw new Error('Échec de la création de l\'utilisateur');
    }
  }

  async updateUser(userId: string, updates: Partial<Omit<User, 'id'>>): Promise<User> {
    try {
      const existingUser = await this.getUserById(userId);
      if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
      }

      const updatedUser: User = {
        ...existingUser,
        ...updates
      };

      this.users.set(userId, updatedUser);
      logger.info('Utilisateur mis à jour avec succès', { userId });
      return updatedUser;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'utilisateur', { userId, error });
      throw new Error('Échec de la mise à jour de l\'utilisateur');
    }
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 