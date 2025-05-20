import { Router } from 'express';
// import { userController } from '../controllers/userController';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware';
import { AuthController } from '../controllers/authController';
import { Response } from 'express';
import { AuthRequest } from '../types/user';

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

// Route protégée pour récupérer l'utilisateur courant et son abonnement
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }
    // Vérifier l'abonnement actif
    const { subscriptionService } = require('../services/subscriptionService');
    const activeSub = await subscriptionService.getActiveSubscription(user.id);
    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      subscription: activeSub ? { status: 'active', expireAt: activeSub.endDate, type: activeSub.plan } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur', error: (error as Error).message });
  }
});

export default router; 