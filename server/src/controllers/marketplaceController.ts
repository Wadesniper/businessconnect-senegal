import { Request, Response } from 'express';
import { AuthRequest } from '../types/custom.express';
import { MarketplaceItem } from '../models/marketplace';

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

      const item = new MarketplaceItem({
        ...req.body,
        seller: userId,
        status: 'pending'
      });

      await item.save();
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la création de l\'article' });
    }
  }

  async updateItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const itemId = req.params.id;

      const item = await MarketplaceItem.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      if (item.seller !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Non autorisé à modifier cet article' });
      }

      const updatedItem = await MarketplaceItem.findByIdAndUpdate(
        itemId,
        { ...req.body, status: 'pending' },
        { new: true }
      );

      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'article' });
    }
  }

  async deleteItem(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const itemId = req.params.id;

      const item = await MarketplaceItem.findById(itemId);
      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      if (item.seller !== userId && req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Non autorisé à supprimer cet article' });
      }

      await MarketplaceItem.findByIdAndDelete(itemId);
      res.json({ message: 'Article supprimé avec succès' });
    } catch (error) {
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