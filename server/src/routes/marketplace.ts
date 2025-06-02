import { Router, RouteHandler, AuthRouteHandler, Request, Response, NextFunction } from '../types/express';
import { MarketplaceController } from '../controllers/marketplaceController';
import authMiddleware from '../middleware/auth';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();
const marketplaceController = new MarketplaceController();

// Middleware pour gérer les erreurs async
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Handlers pour les routes publiques
const getProducts: RouteHandler = async (req: Request, res: Response) => {
  // await marketplaceController.getAllProducts(req, res);
  res.send('getAllProducts');
};

const getProduct: RouteHandler = async (req: Request, res: Response) => {
  // await marketplaceController.getProduct(req, res);
  res.send('getProduct');
};

const getCategories: RouteHandler = async (req: Request, res: Response) => {
  // await marketplaceController.getCategories(req, res);
  res.send('getCategories');
};

const searchProducts: RouteHandler = async (req: Request, res: Response) => {
  // await marketplaceController.searchProducts(req, res);
  res.send('searchProducts');
};

// Handlers pour les routes authentifiées
const createProduct: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.createProduct(req, res);
  res.send('createProduct');
};

const updateProduct: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.updateProduct(req, res);
  res.send('updateProduct');
};

const deleteProduct: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.deleteProduct(req, res);
  res.send('deleteProduct');
};

const favoriteProduct: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.toggleFavorite(req, res);
  res.send('toggleFavorite');
};

// Handlers pour les routes vendeur
const getSellerProducts: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.getSellerProducts(req, res);
  res.send('getSellerProducts');
};

const getSellerOrders: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.getSellerOrders(req, res);
  res.send('getSellerOrders');
};

const updateOrder: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.updateOrderStatus(req, res);
  res.send('updateOrderStatus');
};

// Handlers pour les routes acheteur
const createOrder: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.createOrder(req, res);
  res.send('createOrder');
};

const getOrders: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.getBuyerOrders(req, res);
  res.send('getBuyerOrders');
};

const getOrder: AuthRouteHandler = async (req, res) => {
  // await marketplaceController.getOrder(req, res);
  res.send('getOrder');
};

// Configuration des routes publiques
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
router.get('/categories', getCategories);
router.get('/search', searchProducts);

// Configuration du middleware d'authentification
router.use(authMiddleware);

// Configuration des routes authentifiées
router.post('/products', upload.array('images', 5), asyncHandler(createProduct));
router.put('/products/:id', upload.array('images', 5), asyncHandler(updateProduct));
router.delete('/products/:id', asyncHandler(deleteProduct));
router.post('/products/:id/favorite', asyncHandler(favoriteProduct));
router.get('/seller/products', asyncHandler(getSellerProducts));
router.get('/seller/orders', asyncHandler(getSellerOrders));
router.put('/seller/orders/:id', asyncHandler(updateOrder));
router.post('/orders', asyncHandler(createOrder));
router.get('/orders', asyncHandler(getOrders));
router.get('/orders/:id', asyncHandler(getOrder));

export default router; 