import { Router } from 'express';
import { userController } from '../controllers/userController';
import { userValidation } from '../middleware/validation';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Routes publiques
router.post('/register', userValidation.create, validateRequest, userController.register);
router.post('/login', userValidation.create, validateRequest, userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);

// Routes protégées
router.use(authMiddleware.authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', userValidation.update, validateRequest, userController.updateProfile);
router.delete('/profile', userController.deleteProfile);
router.put('/password', userController.updatePassword);
router.delete('/account', userController.deleteAccount);

// Routes admin
router.use(authMiddleware.isAdmin);

router.get('/users', userController.getAllUsers);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router; 