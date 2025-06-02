import { Router } from 'express';
import { Request, Response, AuthRequest } from '../types/express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validateUser } from '../middleware/validation';
import { UserPayload } from '../types/user';

const router = Router();
const userController = new UserController();

// Routes publiques
router.post('/register', validateUser, userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// Routes protégées
router.use(authenticate);

router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const user = await userController.getProfile(req.user.id);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
  }
});

router.put('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const updatedUser = await userController.updateProfile(req.user.id, req.body);
    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
});

// Routes admin
// router.get('/admin/users', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.getAllUsers(req, res); });
// router.put('/admin/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.updateUser(req, res); });
// router.delete('/admin/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.deleteUser(req, res); });

export default router; 