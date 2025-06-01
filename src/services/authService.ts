import { User, IUser } from '../models/User';
import { AppError } from '../utils/errors';
import { generateToken } from '../utils/jwt';
import { config } from '../config';

export class AuthService {
  async validateUser(phone: string, password: string): Promise<IUser> {
    try {
      const user = await User.findOne({ phone }).select('+password');
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

  async register(userData: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    password: string;
    role: IUser['role'];
  }): Promise<IUser> {
    try {
      const existingUser = await User.findOne({ 
        $or: [
          { phone: userData.phone },
          { email: userData.email }
        ]
      });

      if (existingUser) {
        throw new AppError('Un utilisateur avec ce numéro de téléphone ou cet email existe déjà', 400);
      }

      const user = await User.create(userData);
      return user;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
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

  async requestPasswordReset(phone: string): Promise<void> {
    try {
      const user = await User.findOne({ phone });
      if (!user) {
        throw new AppError('Utilisateur non trouvé', 404);
      }

      const resetToken = generateToken(
        { id: user._id },
        config.JWT_SECRET,
        { expiresIn: '1h' }
      );

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 heure
      await user.save();

      // TODO: Envoyer le token par SMS
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation du mot de passe:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = generateToken(token, config.JWT_SECRET) as { id: string };
      const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        throw new AppError('Token invalide ou expiré', 400);
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  }
} 