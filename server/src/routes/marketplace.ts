import { Router } from 'express';
import { Request, Response, NextFunction, AuthRequest } from '../types/custom.express';
import { MarketplaceController } from '../controllers/marketplaceController';
import { upload } from '../middleware/uploadMiddleware';
import { authenticate } from '../middleware/auth';

const router = Router();
const marketplaceController = new MarketplaceController();

// asyncHandler prend une fonction qui correspond à la signature d'un RequestHandler standard.
// L'assertion vers AuthRequest se fera à l'intérieur de la fonction passée si nécessaire.
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any> | any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware d'authentification pour toutes les routes définies APRÈS cette ligne
router.use(authenticate);

// Handlers. req est typé comme notre Request personnalisé (user est optionnel).
// Si le contrôleur attend AuthRequest (user défini), une assertion sera utilisée lors de l'appel.

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  // Exemple: await marketplaceController.getAllProducts(req as AuthRequest, res);
  res.send('getAllProducts');
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  res.send('getProduct');
};

const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  res.send('getCategories');
};

const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  res.send('searchProducts');
};

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  // Exemple: await marketplaceController.createProduct(req as AuthRequest, res);
  res.send('createProduct');
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  res.send('updateProduct');
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  res.send('deleteProduct');
};

const favoriteProduct = async (req: Request, res: Response, next: NextFunction) => {
  res.send('toggleFavorite');
};

const getSellerProducts = async (req: Request, res: Response, next: NextFunction) => {
  res.send('getSellerProducts');
};

const getSellerOrders = async (req: Request, res: Response, next: NextFunction) => {
  res.send('getSellerOrders');
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  res.send('updateOrderStatus');
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  res.send('createOrder');
};

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  res.send('getBuyerOrders');
};

const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  res.send('getOrder');
};

// Configuration des routes.
router.get('/products', asyncHandler(getProducts));
router.get('/products/:id', asyncHandler(getProduct));
router.get('/categories', asyncHandler(getCategories));
router.get('/search', asyncHandler(searchProducts));

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

// Routes anonymes finales. req est typé Request. Utiliser (req as AuthRequest).user si besoin.
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Pour accéder à req.user, qui est défini par le middleware authenticate:
    // const user = (req as AuthRequest).user; // ou if (req.user)
    return res.json({ message: 'Liste des annonces' });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'Détail de l\'annonce' });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(201).json({ message: 'Annonce créée' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'Annonce mise à jour' });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({ message: 'Annonce supprimée' });
  } catch (error) {
    next(error);
  }
});

export default router; 