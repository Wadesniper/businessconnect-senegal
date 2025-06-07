import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express.js';
import { MarketplaceController } from '../controllers/marketplaceController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
const marketplaceController = new MarketplaceController();

// Wrapper pour gérer les erreurs asynchrones
const asyncHandler = (fn: (req: any, res: Response, next: NextFunction) => Promise<any> | any) => {
  return (req: any, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Routes publiques
router.get('/', asyncHandler((req: Request, res: Response, next: NextFunction) => marketplaceController.getAllItems(req, res)));
router.get('/categories', asyncHandler((req: Request, res: Response, next: NextFunction) => marketplaceController.getCategories(req, res)));
router.get('/search', asyncHandler((req: Request, res: Response, next: NextFunction) => marketplaceController.searchItems(req, res)));
router.get('/:id', asyncHandler((req: Request, res: Response, next: NextFunction) => marketplaceController.getItemById(req, res)));

// Routes protégées
router.post('/', authenticate, upload.array('images', 5), asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => marketplaceController.createItem(req, res)));
router.put('/:id', authenticate, upload.array('images', 5), asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => marketplaceController.updateItem(req, res)));
router.delete('/:id', authenticate, asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => marketplaceController.deleteItem(req, res)));

// Routes admin
router.get('/admin/all', authenticate, asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => marketplaceController.getAllItemsAdmin(req, res)));
router.patch('/admin/:id/status', authenticate, asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => marketplaceController.updateItemStatus(req, res)));
router.delete('/admin/:id', authenticate, asyncHandler((req: AuthRequest, res: Response, next: NextFunction) => marketplaceController.deleteItemAdmin(req, res)));

export default router; 