import { User, IUser } from '../models/User';
import { config } from '../config';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { AppError } from '../utils/appError';

export class AuthService {
  static async validateUser(email: string, password: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return null;

      const isValid = await user.comparePassword(password);
      return isValid ? user : null;
    } catch (error) {
      logger.error('Error validating user:', error);
      throw new AppError('Error validating user', 500);
    }
  }

  static async generateAuthToken(user: IUser): Promise<string> {
    return jwt.sign({ id: user._id.toString() }, config.JWT_SECRET, {
      expiresIn: Number(config.JWT_EXPIRES_IN) || '30d'
    });
  }

  static async register(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      logger.error('Error registering user:', error);
      throw new AppError('Error registering user', 500);
    }
  }

  static async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError('No user found with that email address', 404);
      }

      const resetToken = jwt.sign({ id: user._id }, config.JWT_SECRET, {
        expiresIn: '1h'
      });
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 heure
      await user.save();

      // TODO: Send reset password email
    } catch (error) {
      logger.error('Error requesting password reset:', error);
      throw new AppError('Error requesting password reset', 500);
    }
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as { id: string };
      const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
    } catch (error) {
      logger.error('Error resetting password:', error);
      throw new AppError('Error resetting password', 500);
    }
  }
} 