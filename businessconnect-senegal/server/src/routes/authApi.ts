import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

// Inscription
router.post('/register', authController.register);
// Connexion
router.post('/login', authController.login);
// Vérification de l'email
router.get('/verify/:token', authController.verifyEmail);
// Vérification du token
router.get('/verify-token', authController.verifyToken);

export default router; 