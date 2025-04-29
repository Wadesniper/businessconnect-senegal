import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// Routes protégées
router.use(authMiddleware);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/password', userController.updatePassword);
router.delete('/account', userController.deleteAccount);

// Routes administrateur
router.get('/admin/users', authMiddleware.isAdmin, userController.getAllUsers);
router.put('/admin/user/:id', authMiddleware.isAdmin, userController.updateUser);
router.delete('/admin/user/:id', authMiddleware.isAdmin, userController.deleteUser);

export default router; 