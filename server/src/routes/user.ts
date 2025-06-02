import { Router, Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { Request, AuthRequest } from '../types/express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validateUser } from '../middleware/validation';

const router = Router();
const userController = new UserController();

// Routes publiques
router.post('/register', validateUser, (req: Request, res: ExpressResponse, next: NextFunction) => {
  userController.register(req, res).catch(next);
});

router.post('/login', (req: Request, res: ExpressResponse, next: NextFunction) => {
  userController.login(req, res).catch(next);
});

router.post('/forgot-password', (req: Request, res: ExpressResponse, next: NextFunction) => {
  userController.forgotPassword(req, res).catch(next);
});

router.post('/reset-password', (req: Request, res: ExpressResponse, next: NextFunction) => {
  userController.resetPassword(req, res).catch(next);
});

// Routes protégées
router.use(authenticate);

router.get('/profile', async (req: Request, res: ExpressResponse, next: NextFunction) => {
  try {
    await userController.getProfile(req as AuthRequest, res);
  } catch (error) {
    next(error);
  }
});

router.put('/profile', async (req: Request, res: ExpressResponse, next: NextFunction) => {
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