import { Router } from 'express';
// import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
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

// Route pour obtenir le profil de l'utilisateur connecté
router.get('/me', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
});

export default router; 