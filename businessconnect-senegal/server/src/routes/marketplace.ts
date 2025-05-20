import { Router } from 'express';
import { marketplaceController } from '../controllers/marketplaceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { AuthRequest } from '../types/user';
import { Response } from 'express';

const router = Router();

// Routes publiques
router.get('/products', marketplaceController.getAllProducts);
router.get('/products/:id', marketplaceController.getProduct);
router.get('/categories', marketplaceController.getCategories);
router.get('/search', async (req: AuthRequest, res: Response) => { await marketplaceController.searchProducts(req, res); });

// Routes protégées
router.use(authMiddleware);
// @ts-ignore
router.post('/products', upload.array('images', 5), marketplaceController.createProduct);
// @ts-ignore
router.put('/products/:id', upload.array('images', 5), marketplaceController.updateProduct);
router.delete('/products/:id', marketplaceController.deleteProduct);
router.post('/products/:id/favorite', async (req, res) => { await marketplaceController.toggleFavorite(req, res); });

// Routes vendeur
router.get('/seller/products', async (req, res) => { await marketplaceController.getSellerProducts(req, res); });
router.get('/seller/orders', marketplaceController.getSellerOrders);
router.put('/seller/orders/:id', marketplaceController.updateOrderStatus);

// Routes acheteur
router.post('/orders', marketplaceController.createOrder);
router.get('/orders', marketplaceController.getBuyerOrders);
router.get('/orders/:id', marketplaceController.getOrder);

export default router; 