import { Router } from 'express';
// import { userController } from '../controllers/userController';
import { authMiddleware, isAdmin } from '../middleware/authMiddleware';
import { AuthController } from '../controllers/authController';
import { Response } from 'express';
import { AuthRequest } from '../types/user';
import { User } from '../models/User';

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
// router.use('/admin', authMiddleware, isAdmin);

// Liste des utilisateurs (admin)
// router.get('/admin/users', async (req, res) => {
//   ...
// });

// Route protégée pour récupérer l'utilisateur courant et son abonnement
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ success: false, message: 'Non authentifié' });
    return;
  }
  // Correction : mapping du rôle pour compatibilité frontend
  let frontendRole = user.role;
  if (frontendRole === 'user') frontendRole = 'employeur';
  // Vérifier l'abonnement actif
  const { subscriptionService } = require('../services/subscriptionService');
  subscriptionService.getActiveSubscription(user.id)
    .then((activeSub: any) => {
      res.json({
        id: user.id,
        email: user.email,
        role: frontendRole,
        subscription: activeSub ? { status: 'active', expireAt: activeSub.endDate, type: activeSub.plan } : null
      });
    })
    .catch((error: any) => {
      res.status(500).json({ success: false, message: 'Erreur serveur', error: (error as Error).message });
    });
});

export default router; 