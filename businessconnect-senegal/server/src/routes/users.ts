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
router.use('/admin', authMiddleware, isAdmin);

// Liste des utilisateurs (admin)
router.get('/admin/users', async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const total = await User.countDocuments();
  const users = await User.find().skip(skip).limit(limit);
  const { subscriptionService } = require('../services/subscriptionService');
  const usersWithSub = await Promise.all(users.map(async (user) => {
    const activeSub = await subscriptionService.getActiveSubscription(user._id);
    return {
      id: user._id,
      name: user.name,
      email: user.email || '',
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      subscription: activeSub ? {
        status: 'active',
        expireAt: activeSub.endDate,
        type: activeSub.plan
      } : { status: 'none' }
    };
  }));
  res.json({ data: usersWithSub, total });
});

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