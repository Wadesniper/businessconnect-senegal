import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  validateRequest
} from '../utils/validation';

const router = Router();

// Routes publiques
router.post('/register', registerValidation, validateRequest, userController.register);
router.post('/login', loginValidation, validateRequest, userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.get('/verify/:token', userController.verifyEmail);

// Routes authentifiées
router.use(authMiddleware);
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidation, validateRequest, userController.updateProfile);
router.put('/password', changePasswordValidation, validateRequest, userController.changePassword);

// Routes admin
router.get('/admin/users', authMiddleware.isAdmin, userController.getAllUsers);
router.put('/admin/users/:id', authMiddleware.isAdmin, userController.updateUser);
router.delete('/admin/users/:id', authMiddleware.isAdmin, userController.deleteUser);

export default router; 