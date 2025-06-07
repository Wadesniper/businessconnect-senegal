import { Router } from 'express';
// import { userController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { AuthController } from '../controllers/authController.js';
// import { UserController } from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express.js';
import { User } from '../models/User.js';

const router = Router();
const authController = new AuthController();

// Routes publiques
router.post('/register', (req: Request, res: Response, next: NextFunction) => {
  authController.register(req, res).catch(next);
});
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  authController.login(req, res).catch(next);
});
// router.post('/forgot-password', userController.forgotPassword);
// router.post('/reset-password', userController.resetPassword);

// Routes protégées
router.use(authenticate);
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
router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    const user = await User.findById(authReq.user.id).select('-password');
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
    next(error);
  }
});

// Routes protégées (nécessitent une authentification)
router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentification requise'
      });
    }
    const user = await User.findById(authReq.user.id).select('-password');
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
    next(error);
  }
});

export default router; 