import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

// Routes publiques (pas besoin d'authentification)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/verify/:token', authController.verifyEmail);
router.get('/verify-token/:token', authController.verifyToken);

export default router; 