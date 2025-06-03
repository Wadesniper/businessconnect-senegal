import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express';

const router = Router();
const authController = new AuthController();

// Routes publiques (pas besoin d'authentification)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email/:token', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/verify-token/:token', authController.verifyToken);

// Routes protégées (nécessitent une authentification)

const getCurrentUserHandler = (req: Request, res: Response, next: NextFunction) => {
  authController.getCurrentUser(req as AuthRequest, res, next).catch(next);
};

const updateProfileHandler = (req: Request, res: Response, next: NextFunction) => {
  authController.updateProfile(req as AuthRequest, res, next).catch(next);
};

router.get('/me', authMiddleware, getCurrentUserHandler);
router.patch('/profile', authMiddleware, updateProfileHandler);

export default router; 