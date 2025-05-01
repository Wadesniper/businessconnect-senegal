import { Request, Response } from 'express';
import { Cart } from '../models/cart';
import { logger } from '../utils/logger';

export class CartController {
  async getCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const cart = await Cart.findOne({ userId })
        .populate('items.productId', 'title price images');

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
      }

      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération du panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du panier'
      });
    }
  }

  async addToCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { productId, quantity } = req.body;

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({
          userId,
          items: []
        });
      }

      const existingItem = cart.items.find(
        item => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          quantity,
          price: req.body.price
        });
      }

      await cart.save();

      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      logger.error('Erreur lors de l\'ajout au panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'ajout au panier'
      });
    }
  }

  async updateCartItem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { productId, quantity } = req.body;

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
      }

      const item = cart.items.find(
        item => item.productId.toString() === productId
      );

      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Article non trouvé dans le panier'
        });
      }

      if (quantity === 0) {
        cart.items = cart.items.filter(
          item => item.productId.toString() !== productId
        );
      } else {
        item.quantity = quantity;
      }

      await cart.save();

      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du panier'
      });
    }
  }

  async removeFromCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const { productId } = req.params;

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
      }

      cart.items = cart.items.filter(
        item => item.productId.toString() !== productId
      );

      await cart.save();

      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression du panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du panier'
      });
    }
  }

  async clearCart(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        return res.status(404).json({
          success: false,
          message: 'Panier non trouvé'
        });
      }

      cart.items = [];
      await cart.save();

      res.json({
        success: true,
        message: 'Panier vidé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors du vidage du panier:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du vidage du panier'
      });
    }
  }
} 