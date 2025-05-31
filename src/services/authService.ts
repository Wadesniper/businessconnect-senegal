import { User } from '../models/User';
import { AppError } from '../utils/errors';
import { generateToken } from '../types/jwt';
import { config } from '../config';
import { IUser } from '../types/user';

export class AuthService {
  async validateUser(email: string, password: string): Promise<IUser> {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new AppError('Mot de passe incorrect', 401);
      }

      return user;
    } catch (error) {
      console.error('Erreur lors de la validation de l\'utilisateur:', error);
      throw error;
    }
  }

  generateAuthToken(userId: string): string {
    return generateToken(
      { id: userId },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );
  }
} 