import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Routes protégées
router.use(authMiddleware.authenticate);
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.put('/password', authController.updatePassword);
router.delete('/account', authController.deleteAccount);

// Routes admin
router.get('/admin/users', authMiddleware.isAdmin, authController.getAllUsers);
router.put('/admin/user/:id', authMiddleware.isAdmin, authController.updateUser);
router.delete('/admin/user/:id', authMiddleware.isAdmin, authController.deleteUser);

export default router; 