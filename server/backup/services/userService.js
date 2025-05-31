"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const logger_1 = require("../utils/logger");
class UserService {
    constructor() {
        this.users = new Map();
    }
    async getUserById(userId) {
        try {
            const user = this.users.get(userId);
            return user || null;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la récupération de l\'utilisateur', { userId, error });
            throw new Error('Échec de la récupération de l\'utilisateur');
        }
    }
    async getUserByEmail(email) {
        try {
            const users = Array.from(this.users.values());
            return users.find(user => user.email === email) || null;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la recherche de l\'utilisateur par email', { email, error });
            throw new Error('Échec de la recherche de l\'utilisateur');
        }
    }
    async createUser(userData) {
        try {
            const id = this.generateUserId();
            const user = {
                id,
                ...userData
            };
            this.users.set(id, user);
            logger_1.logger.info('Utilisateur créé avec succès', { userId: id });
            return user;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la création de l\'utilisateur', { error });
            throw new Error('Échec de la création de l\'utilisateur');
        }
    }
    async updateUser(userId, updates) {
        try {
            const existingUser = await this.getUserById(userId);
            if (!existingUser) {
                throw new Error('Utilisateur non trouvé');
            }
            const updatedUser = {
                ...existingUser,
                ...updates
            };
            this.users.set(userId, updatedUser);
            logger_1.logger.info('Utilisateur mis à jour avec succès', { userId });
            return updatedUser;
        }
        catch (error) {
            logger_1.logger.error('Erreur lors de la mise à jour de l\'utilisateur', { userId, error });
            throw new Error('Échec de la mise à jour de l\'utilisateur');
        }
    }
    generateUserId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.UserService = UserService;
