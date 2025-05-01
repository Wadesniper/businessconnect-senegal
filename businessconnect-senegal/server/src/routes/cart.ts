import express from 'express';
import { CartController } from '../controllers/cartController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { body } from 'express-validator';

const router = express.Router();
const cartController = new CartController();

// Middleware d'authentification pour toutes les routes du panier
router.use(authMiddleware);

// Obtenir le panier de l'utilisateur
router.get('/', cartController.getCart);

// Ajouter un produit au panier
router.post(
  '/add',
  [
    body('productId').notEmpty().withMessage('ID du produit requis'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('La quantité doit être un nombre positif'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif')
  ],
  validateRequest,
  cartController.addToCart
);

// Mettre à jour la quantité d'un produit
router.put(
  '/update',
  [
    body('productId').notEmpty().withMessage('ID du produit requis'),
    body('quantity')
      .isInt({ min: 0 })
      .withMessage('La quantité doit être un nombre positif ou zéro')
  ],
  validateRequest,
  cartController.updateCartItem
);

// Supprimer un produit du panier
router.delete('/remove/:productId', cartController.removeFromCart);

// Vider le panier
router.delete('/clear', cartController.clearCart);

export default router; 