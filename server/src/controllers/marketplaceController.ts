import { Request, Response, AuthRequest } from '../types/custom.express.js';
import { logger } from '../utils/logger.js';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export class MarketplaceController {
  async getAllItems(req: Request, res: Response) {
    try {
      logger.info('[MARKETPLACE] getAllItems called');
      const items = await prisma.marketplaceItem.findMany({
        where: { status: 'approved' }
      });
      logger.info(`[MARKETPLACE] getAllItems found ${items.length} items`);
      res.json(items);
    } catch (error) {
      logger.error('[MARKETPLACE] getAllItems error', error);
      const errMsg = (error instanceof Error) ? error.message : String(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des articles', details: errMsg });
    }
  }

  async getItemById(req: Request, res: Response) {
    try {
      const item = await prisma.marketplaceItem.findUnique({
        where: { id: req.params.id }
      });
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
        searchQuery.OR = [
          { title: { contains: query as string, mode: 'insensitive' } },
          { description: { contains: query as string, mode: 'insensitive' } }
        ];
      }

      if (category) {
        searchQuery.category = category;
      }

      const items = await prisma.marketplaceItem.findMany({
        where: searchQuery
      });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la recherche d\'articles' });
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.marketplaceItem.findMany({
        select: { category: true },
        distinct: ['category']
      });
      res.json(categories.map(c => c.category));
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

      logger.info('[MARKETPLACE][createItem] Body reçu:', req.body);
      logger.info('[MARKETPLACE][createItem] Images:', req.body.images);
      console.log('[MARKETPLACE][createItem] Body reçu:', req.body);
      console.log('[MARKETPLACE][createItem] Images:', req.body.images);

      // Correction robuste : garantir que req.body.images est toujours un tableau
      if (!Array.isArray(req.body.images)) {
        if (typeof req.body.images === 'string' && req.body.images) {
          try {
            req.body.images = JSON.parse(req.body.images);
          } catch {
            req.body.images = [req.body.images];
          }
        } else if (req.body.images == null) {
          req.body.images = [];
        } else {
          req.body.images = [req.body.images];
        }
      }

      const { contactInfo, ...rest } = req.body;
      const contactEmail = contactInfo?.email || req.body.contactEmail || null;
      const contactPhone = contactInfo?.phone || req.body.contactPhone || '';
      // Validation du téléphone obligatoire
      if (!contactPhone || !/^\+?\d{7,15}$/.test(contactPhone)) {
        return res.status(400).json({ error: 'Le numéro de téléphone est obligatoire et doit être valide.' });
      }

      // Suppression du champ seller pour éviter le conflit avec sellerId
      const { seller, ...dataForPrisma } = rest;

      console.log('[DEBUG BACKEND] data envoyé à Prisma:', {
        ...dataForPrisma,
        contactEmail,
        contactPhone,
        sellerId: userId,
        status: 'approved',
        images: Array.isArray(rest.images) ? rest.images : [],
      });

      const item = await prisma.marketplaceItem.create({
        data: {
          ...dataForPrisma,
          contactEmail,
          contactPhone,
          sellerId: userId,
          status: 'approved',
          images: Array.isArray(rest.images) ? rest.images : [],
        }
      });
      res.status(201).json(item);
    } catch (error) {
      logger.error('[MARKETPLACE][createItem] Erreur:', error);
      console.log('[MARKETPLACE][createItem] Erreur:', error);
      res.status(500).json({
        error: 'Erreur lors de la création de l\'article',
        details: (error instanceof Error ? error.message : String(error)),
        body: req.body,
        images: req.body.images,
        stack: error instanceof Error ? error.stack : error
      });
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

      const item = await prisma.marketplaceItem.findUnique({
        where: { id: itemId }
      });

      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      if (item.sellerId !== userId && req.user?.role !== 'admin') {
        logger.warn('Tentative non autorisée de modification', {
          userId,
          itemId,
          itemSeller: item.sellerId,
          userRole: req.user?.role
        });
        return res.status(403).json({ error: 'Non autorisé à modifier cet article' });
      }

      const updatedItem = await prisma.marketplaceItem.update({
        where: { id: itemId },
        data: { ...req.body }
      });

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

      const item = await prisma.marketplaceItem.findUnique({
        where: { id: itemId }
      });

      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      if (item.sellerId !== userId && req.user?.role !== 'admin') {
        logger.warn('Tentative non autorisée de suppression', {
          userId,
          itemId,
          itemSeller: item.sellerId,
          userRole: req.user?.role
        });
        return res.status(403).json({ error: 'Non autorisé à supprimer cet article' });
      }

      await prisma.marketplaceItem.delete({
        where: { id: itemId }
      });

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

      const items = await prisma.marketplaceItem.findMany({
        include: {
          seller: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      });
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

      const item = await prisma.marketplaceItem.update({
        where: { id: itemId },
        data: { status }
      });

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
      const item = await prisma.marketplaceItem.delete({
        where: { id: itemId }
      });

      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      res.json({ message: 'Article supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de l\'article' });
    }
  }
} 