import { Router } from 'express';
// import { userController } from '../controllers/userController';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware';
import { AuthController } from '../controllers/authController';

const router = Router();
const authController = new AuthController();

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);
// router.post('/forgot-password', userController.forgotPassword);
// router.post('/reset-password', userController.resetPassword);

// Routes protégées
router.use(authMiddleware);
// router.get('/profile', userController.getProfile);
// router.put('/profile', userController.updateProfile);
// router.put('/password', userController.updatePassword);
// router.delete('/account', userController.deleteAccount);

// Routes administrateur
// router.get('/admin/users', isAdmin, userController.getAllUsers);
// router.put('/admin/user/:id', isAdmin, userController.updateUser);
// router.delete('/admin/user/:id', isAdmin, userController.deleteUser);

export default router; 