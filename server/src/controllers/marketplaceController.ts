import { Request, Response, AuthRequest } from '../types/custom.express.js';
import { logger } from '../utils/logger.js';
import { config } from '../config.js';
import { StorageService } from '../services/storageService.js';
import { MarketplaceItem } from '../models/marketplace.js';

export class MarketplaceController {
  async getAllItems(req: Request, res: Response) {
    try {
      const items = await MarketplaceItem.find({ status: 'approved' });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
    }
  }

  async getItemById(req: Request, res: Response) {
    try {
      const item = await MarketplaceItem.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de l\'article' });
    }
  }

  async searchItems(req: Request, res: Response) {
    try {
      const { query, category } = req.query;
      const searchQuery: any = { status: 'approved' };

      if (query) {
        searchQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ];
      }

      if (category) {
        searchQuery.category = category;
      }

      const items = await MarketplaceItem.find(searchQuery);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la recherche d\'articles' });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await MarketplaceItem.distinct('category');
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
    }
  }

  async createItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Non autorisé' });
      }

      const { contactEmail, contactPhone, ...rest } = req.body;
      // Validation du téléphone obligatoire
      if (!contactPhone || !/^\+?\d{7,15}$/.test(contactPhone)) {
        return res.status(400).json({ error: 'Le numéro de téléphone est obligatoire et doit être valide.' });
      }

      const item = await MarketplaceItem.create({
        ...rest,
        contactEmail: contactEmail || null,
        contactPhone,
        seller: userId,
        status: 'approved',
        images: Array.isArray(rest.images) ? rest.images : [],
      });
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
    }
  }

  async updateItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const itemId = req.params.id;

      logger.info('Tentative de modification d\'article', {
        userId,
        itemId,
        userRole: req.user?.role
      });

      const item = await MarketplaceItem.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      if (item.seller !== userId && req.user?.role !== 'admin') {
        logger.warn('Tentative non autorisée de modification', {
          userId,
          itemId,
          itemSeller: item.seller,
          userRole: req.user?.role
        });
        return res.status(403).json({ error: 'Non autorisé à modifier cet article' });
      }

      const updatedItem = await MarketplaceItem.findByIdAndUpdate(
        itemId,
        { ...req.body },
        { new: true }
      );

      logger.info('Article modifié avec succès', { itemId, userId });
      res.json(updatedItem);
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de l\'article', { error });
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
    }
  }

  async deleteItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const itemId = req.params.id;

      logger.info('Tentative de suppression d\'article', {
        userId,
        itemId,
        userRole: req.user?.role
      });

      const item = await MarketplaceItem.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      if (item.seller !== userId && req.user?.role !== 'admin') {
        logger.warn('Tentative non autorisée de suppression', {
          userId,
          itemId,
          itemSeller: item.seller,
          userRole: req.user?.role
        });
        return res.status(403).json({ error: 'Non autorisé à supprimer cet article' });
      }

      await MarketplaceItem.findByIdAndDelete(itemId);
      logger.info('Article supprimé avec succès', { itemId, userId });
      res.json({ message: 'Article supprimé avec succès' });
    } catch (error) {
      logger.error('Erreur lors de la suppression de l\'article', { error });
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
    }
  }

  // Routes admin
  async getAllItemsAdmin(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const items = await MarketplaceItem.find().populate('seller', 'firstName lastName email');
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
    }
  }

  async updateItemStatus(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const { status } = req.body;
      const itemId = req.params.id;

      const item = await MarketplaceItem.findByIdAndUpdate(
        itemId,
        { status },
        { new: true }
      );

      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
  }

  async deleteItemAdmin(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const itemId = req.params.id;
      const item = await MarketplaceItem.findByIdAndDelete(itemId);

      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      res.json({ message: 'Article supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
    }
  }
} 