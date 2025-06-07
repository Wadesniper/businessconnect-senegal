import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express.js';

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
router.get('/me', authMiddleware, (req: AuthRequest, res: Response, next: NextFunction) => {
  authController.getCurrentUser(req, res, next).catch(next);
});

router.patch('/profile', authMiddleware, (req: AuthRequest, res: Response, next: NextFunction) => {
  authController.updateProfile(req, res, next).catch(next);
});

export default router; 