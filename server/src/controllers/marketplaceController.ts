import { Request, Response, AuthRequest } from '../types/custom.express.js';
import { logger } from '../utils/logger.js';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export class MarketplaceController {
  async getAllItems(req: AuthRequest, res: Response) {
    try {
      logger.info('[MARKETPLACE] getAllItems called');
      
      const items = await prisma.marketplaceItem.findMany({
        where: {
          status: {
            in: ['approved', 'pending', 'rejected', 'suspended']
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
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
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      logger.info('[MARKETPLACE][createItem] Début de la création');
      console.log('[MARKETPLACE][createItem] Données reçues:', req.body);

      // Extraire les données nécessaires
      const { contactEmail, contactPhone, priceType, price, minPrice, maxPrice, ...rest } = req.body;

      // Valider les données selon le type de prix
      if (priceType === 'fixed' && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ error: 'Prix invalide pour le type fixe' });
      }

      if (priceType === 'range' && (
        typeof minPrice !== 'number' || 
        typeof maxPrice !== 'number' || 
        minPrice < 0 || 
        maxPrice < minPrice
      )) {
        return res.status(400).json({ error: 'Prix invalides pour la fourchette de prix' });
      }

      // Préparer les données pour Prisma
      const dataForPrisma = {
        ...rest,
        priceType,
        price: priceType === 'fixed' ? price : null,
        minPrice: priceType === 'range' ? minPrice : null,
        maxPrice: priceType === 'range' ? maxPrice : null,
        contactEmail,
        contactPhone,
        sellerId: userId,
        status: 'approved',
        images: Array.isArray(rest.images) ? rest.images : []
      };

      logger.info('[MARKETPLACE][createItem] Données formatées:', dataForPrisma);

      const item = await prisma.marketplaceItem.create({
        data: dataForPrisma
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
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const itemId = req.params.id;
      const { contactEmail, contactPhone, priceType, price, minPrice, maxPrice, ...rest } = req.body;

      // Vérifier que l'item existe et appartient à l'utilisateur
      const existingItem = await prisma.marketplaceItem.findFirst({
        where: {
          id: itemId,
          sellerId: userId
        }
      });

      if (!existingItem) {
        return res.status(404).json({ error: 'Article non trouvé ou non autorisé' });
      }

      // Valider les données selon le type de prix
      if (priceType === 'fixed' && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ error: 'Prix invalide pour le type fixe' });
      }

      if (priceType === 'range' && (
        typeof minPrice !== 'number' || 
        typeof maxPrice !== 'number' || 
        minPrice < 0 || 
        maxPrice < minPrice
      )) {
        return res.status(400).json({ error: 'Prix invalides pour la fourchette de prix' });
      }

      // Préparer les données pour Prisma
      const dataForPrisma = {
        ...rest,
        priceType,
        price: priceType === 'fixed' ? price : null,
        minPrice: priceType === 'range' ? minPrice : null,
        maxPrice: priceType === 'range' ? maxPrice : null,
        contactEmail,
        contactPhone,
        images: Array.isArray(rest.images) ? rest.images : []
      };

      const updatedItem = await prisma.marketplaceItem.update({
        where: { id: itemId },
        data: dataForPrisma
      });

      res.json(updatedItem);
    } catch (error) {
      logger.error('[MARKETPLACE][updateItem] Erreur:', error);
      res.status(500).json({
        error: 'Erreur lors de la mise à jour de l\'article',
        details: error instanceof Error ? error.message : String(error)
      });
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

      logger.info('[MARKETPLACE][getAllItemsAdmin] Début de la récupération');

      const items = await prisma.marketplaceItem.findMany({
        include: {
          seller: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      logger.info(`[MARKETPLACE][getAllItemsAdmin] ${items.length} articles trouvés`);
      res.json(items);
    } catch (error) {
      logger.error('[MARKETPLACE][getAllItemsAdmin] Erreur:', error);
      console.error('[MARKETPLACE][getAllItemsAdmin] Erreur détaillée:', error);
      res.status(500).json({ 
        error: 'Erreur lors de la récupération des articles',
        details: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async updateItemStatus(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const { status, moderationComment } = req.body;
      const itemId = req.params.id;

      // Valider le statut
      const validStatuses = ['approved', 'pending', 'rejected', 'suspended'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Statut invalide' });
      }

      const item = await prisma.marketplaceItem.update({
        where: { id: itemId },
        data: { 
          status,
          moderationComment: moderationComment || null,
          moderatedAt: new Date(),
          moderatedBy: req.user.id
        },
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

      if (!item) {
        return res.status(404).json({ error: 'Article non trouvé' });
      }

      // TODO: Envoyer une notification à l'annonceur
      // await this.sendModerationNotification(item, status, moderationComment);

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
    }
  }

  // Méthode pour récupérer les annonces d'un utilisateur avec leur statut
  async getUserItems(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
      }

      const items = await prisma.marketplaceItem.findMany({
        where: { sellerId: userId },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des articles' });
    }
  }

  // Méthode pour récupérer les statistiques de modération
  async getModerationStats(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const stats = await prisma.marketplaceItem.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      });

      const formattedStats = stats.reduce((acc, stat) => {
        acc[stat.status] = stat._count.status;
        return acc;
      }, {} as Record<string, number>);

      res.json(formattedStats);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
  }

  // Méthode pour récupérer les annonces en attente de modération
  async getPendingItems(req: AuthRequest, res: Response) {
    try {
      if (req.user?.role !== 'admin') {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const items = await prisma.marketplaceItem.findMany({
        where: { 
          OR: [
            { status: 'pending' },
            { status: 'suspended' }
          ]
        },
        include: {
          seller: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      res.json(items);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des articles en attente' });
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