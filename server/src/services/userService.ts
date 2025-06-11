import { logger } from '../utils/logger.js';
import prisma from '../config/prisma.js';
import { $Enums } from '../generated/prisma/index.js';

export interface User {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  role: 'etudiant' | 'annonceur' | 'recruteur' | 'admin' | 'pending';
}

export class UserService {
  // Toutes les opérations utilisent Prisma/Supabase

  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      return user ? {
        id: user.id,
        email: user.email || '',
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        phoneNumber: user.phoneNumber,
        role: user.role as User['role'],
      } : null;
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'utilisateur', { userId, error });
      throw new Error('Échec de la récupération de l\'utilisateur');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      return user ? {
        id: user.id,
        email: user.email || '',
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        phoneNumber: user.phoneNumber,
        role: user.role as User['role'],
      } : null;
    } catch (error) {
      logger.error('Erreur lors de la recherche de l\'utilisateur par email', { email, error });
      throw new Error('Échec de la recherche de l\'utilisateur');
    }
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    try {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: userData.password,
          phoneNumber: userData.phoneNumber,
          role: (userData.role as $Enums.UserRole) || $Enums.UserRole.pending,
        }
      });
      logger.info('Utilisateur créé avec succès', { userId: user.id });
      return {
        id: user.id,
        email: user.email || '',
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        phoneNumber: user.phoneNumber,
        role: user.role as User['role'],
      };
    } catch (error) {
      logger.error('Erreur lors de la création de l\'utilisateur', { error });
      throw new Error('Échec de la création de l\'utilisateur');
    }
  }

  async updateUser(userId: string, updates: Partial<Omit<User, 'id'>>): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updates,
          role: updates.role ? (updates.role as $Enums.UserRole) : undefined,
        }
      });
      logger.info('Utilisateur mis à jour avec succès', { userId });
      return {
        id: user.id,
        email: user.email || '',
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        phoneNumber: user.phoneNumber,
        role: user.role as User['role'],
      };
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'utilisateur', { userId, error });
      throw new Error('Échec de la mise à jour de l\'utilisateur');
    }
  }
} 