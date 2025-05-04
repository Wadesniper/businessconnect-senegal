import { Request, Response } from 'express';
import { User } from '../models/user';
import { ApiResponse, AuthenticatedRequest, ApiError } from '../types/global';
import { generateToken } from '../utils/auth';
import { sendEmail } from '../utils/email';
import { v4 as uuidv4 } from 'uuid';
import { IUser, UserRole, UserCreateData, UserResponse, UserLoginRequest } from '../types/user';

export const userController = {
  async register(req: Request<{}, {}, UserCreateData>, res: Response<ApiResponse<{ token: string; user: UserResponse }>>) {
    try {
      const { email, password, firstName, lastName, role } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        });
      }

      const verificationToken = uuidv4();
      const user = new User({
        email,
        password,
        firstName,
        lastName,
        role,
        verificationToken
      });

      await user.save();

      // Envoyer l'email de vérification
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
      await sendEmail({
        to: email,
        subject: 'Vérification de votre compte BusinessConnect',
        html: `
          <h1>Bienvenue sur BusinessConnect Sénégal</h1>
          <p>Cliquez sur le lien suivant pour vérifier votre compte :</p>
          <a href="${verificationUrl}">${verificationUrl}</a>
        `
      });

      const token = generateToken(user);

      res.status(201).json({
        success: true,
        message: 'Inscription réussie. Veuillez vérifier votre email.',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'inscription',
        errors: [{
          msg: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
        }]
      });
    }
  },

  async login(req: Request<{}, {}, UserLoginRequest>, res: Response<ApiResponse<{ token: string; user: UserResponse }>>) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Email ou mot de passe incorrect'
        });
      }

      const token = generateToken(user);

      res.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isVerified: user.isVerified
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la connexion',
        errors: [{
          msg: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
        }]
      });
    }
  },

  async verifyEmail(req: Request, res: Response<ApiResponse>) {
    try {
      const { token } = req.params;

      const user = await User.findOne({ verificationToken: token });
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token de vérification invalide'
        });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Email vérifié avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification de l\'email',
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
      });
    }
  },

  async forgotPassword(req: Request, res: Response<ApiResponse>) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Aucun utilisateur trouvé avec cet email'
        });
      }

      const resetToken = uuidv4();
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
      await user.save();

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      await sendEmail({
        to: email,
        subject: 'Réinitialisation de votre mot de passe BusinessConnect',
        html: `
          <h1>Réinitialisation de mot de passe</h1>
          <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>Ce lien expirera dans 1 heure.</p>
        `
      });

      res.json({
        success: true,
        message: 'Email de réinitialisation envoyé'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email de réinitialisation',
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
      });
    }
  },

  async resetPassword(req: Request, res: Response<ApiResponse>) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Token de réinitialisation invalide ou expiré'
        });
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la réinitialisation du mot de passe',
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
      });
    }
  },

  async changePassword(req: Request, res: Response<ApiResponse>) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Mot de passe actuel incorrect'
        });
      }

      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Mot de passe modifié avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors du changement de mot de passe',
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
      });
    }
  },

  async getProfile(req: AuthenticatedRequest, res: Response<ApiResponse<UserResponse>>) {
    try {
      const userId = req.user?.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      res.json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          subscription: user.subscription
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du profil',
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
      });
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response<ApiResponse<UserResponse>>) {
    try {
      const userId = req.user?.id;
      const { firstName, lastName, email } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
      }

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: 'Cet email est déjà utilisé'
          });
        }
        user.email = email;
      }

      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      await user.save();

      res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du profil',
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
      });
    }
  },

  async deleteAccount(req: Request, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;

      await User.findByIdAndDelete(userId);

      res.json({
        success: true,
        message: 'Compte supprimé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du compte',
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
      });
    }
  },

  async getAllUsers(req: AuthenticatedRequest, res: Response<ApiResponse<UserResponse[]>>): Promise<void> {
    try {
      const users = await User.find().select('-password');

      res.json({
        success: true,
        data: users.map(user => ({
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          subscription: user.subscription
        }))
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des utilisateurs',
        errors: [{
          msg: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
        }]
      });
    }
  },

  async updateUser(req: AuthenticatedRequest, res: Response<ApiResponse<UserResponse>>): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).select('-password');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isVerified: user.isVerified,
          subscription: user.subscription
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        errors: [{
          msg: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
        }]
      });
    }
  },

  async deleteUser(req: AuthenticatedRequest, res: Response<ApiResponse>): Promise<void> {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Utilisateur supprimé avec succès'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de l\'utilisateur',
        errors: [{
          msg: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
        }]
      });
    }
  }
}; 