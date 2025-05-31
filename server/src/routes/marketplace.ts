import { Router } from 'express';
// import { marketplaceController } from '../controllers/marketplaceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { AuthRequest } from '../types/user';
import { Response } from 'express';

const router = Router();

// Routes publiques
router.get('/products', async (req, res) => {
  // await marketplaceController.getAllProducts(req, res);
  res.send('getAllProducts');
});
router.get('/products/:id', async (req, res) => {
  // await marketplaceController.getProduct(req, res);
  res.send('getProduct');
});
router.get('/categories', async (req, res) => {
  // await marketplaceController.getCategories(req, res);
  res.send('getCategories');
});
router.get('/search', async (req: AuthRequest, res: Response) => {
  // await marketplaceController.searchProducts(req, res);
  res.send('searchProducts');
});

// Routes protégées
router.use(authMiddleware);
// @ts-ignore
router.post('/products', upload.array('images', 5), async (req, res) => {
  // await marketplaceController.createProduct(req, res);
  res.send('createProduct');
});
// @ts-ignore
router.put('/products/:id', upload.array('images', 5), async (req, res) => {
  // await marketplaceController.updateProduct(req, res);
  res.send('updateProduct');
});
router.delete('/products/:id', async (req, res) => {
  // await marketplaceController.deleteProduct(req, res);
  res.send('deleteProduct');
});
router.post('/products/:id/favorite', async (req, res) => {
  // await marketplaceController.toggleFavorite(req, res);
  res.send('toggleFavorite');
});

// Routes vendeur
router.get('/seller/products', async (req, res) => {
  // await marketplaceController.getSellerProducts(req, res);
  res.send('getSellerProducts');
});
router.get('/seller/orders', async (req, res) => {
  // await marketplaceController.getSellerOrders(req, res);
  res.send('getSellerOrders');
});
router.put('/seller/orders/:id', async (req, res) => {
  // await marketplaceController.updateOrderStatus(req, res);
  res.send('updateOrderStatus');
});

// Routes acheteur
router.post('/orders', async (req, res) => {
  // await marketplaceController.createOrder(req, res);
  res.send('createOrder');
});
router.get('/orders', async (req, res) => {
  // await marketplaceController.getBuyerOrders(req, res);
  res.send('getBuyerOrders');
});
router.get('/orders/:id', async (req, res) => {
  // await marketplaceController.getOrder(req, res);
  res.send('getOrder');
});

export default router; 