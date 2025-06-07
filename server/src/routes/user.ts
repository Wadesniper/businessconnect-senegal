import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express.js';
import { UserController } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validateUser } from '../middleware/validation.js';

const router = Router();
const userController = new UserController();

// Routes publiques
router.post('/register', validateUser, (req: Request, res: Response, next: NextFunction) => {
  userController.register(req, res).catch(next);
});

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  userController.login(req, res).catch(next);
});

router.post('/forgot-password', (req: Request, res: Response, next: NextFunction) => {
  userController.forgotPassword(req, res).catch(next);
});

router.post('/reset-password', (req: Request, res: Response, next: NextFunction) => {
  userController.resetPassword(req, res).catch(next);
});

// Routes protégées
router.use(authenticate);

router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.getProfile(req as AuthRequest, res);
  } catch (error) {
    next(error);
  }
});

router.put('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userController.updateProfile(req as AuthRequest, res);
  } catch (error) {
    next(error);
  }
});

// Routes admin
// router.get('/admin/users', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.getAllUsers(req, res); });
// router.put('/admin/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.updateUser(req, res); });
// router.delete('/admin/users/:id', authMiddleware, async (req: AuthRequest, res: Response) => { await userController.deleteUser(req, res); });

export default router; 