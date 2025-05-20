import { Response } from 'express';
import { logger } from '../utils/logger';
import { query } from '../config/database';
import { AuthRequest } from '../types/user';

export const marketplaceController = {
  async getAllProducts(req: AuthRequest, res: Response) {
    try {
      const { category, minPrice, maxPrice, sort } = req.query;
      let sqlQuery = `
        SELECT p.*, u.name as seller_name, c.name as category_name
        FROM products p
        JOIN users u ON p.seller_id = u.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
      `;

      const params: any[] = [];
      if (category) {
        sqlQuery += ' AND c.id = $' + (params.length + 1);
        params.push(category);
      }
      if (minPrice) {
        sqlQuery += ' AND p.price >= $' + (params.length + 1);
        params.push(minPrice);
      }
      if (maxPrice) {
        sqlQuery += ' AND p.price <= $' + (params.length + 1);
        params.push(maxPrice);
      }

      if (sort === 'price_asc') {
        sqlQuery += ' ORDER BY p.price ASC';
      } else if (sort === 'price_desc') {
        sqlQuery += ' ORDER BY p.price DESC';
      } else {
        sqlQuery += ' ORDER BY p.created_at DESC';
      }

      const result = await query(sqlQuery, params);
      res.json({
        status: 'success',
        data: result.rows
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la récupération des produits'
      });
    }
  },

  async getProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const result = await query(`
        SELECT p.*, u.name as seller_name, c.name as category_name
        FROM products p
        JOIN users u ON p.seller_id = u.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.id = $1
      `, [id]);

      if (result.rows.length === 0) {
        res.status(404).json({
          status: 'error',
          message: 'Produit non trouvé'
        });
        return;
      }

      res.json({
        status: 'success',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération du produit:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la récupération du produit'
      });
    }
  },

  async createProduct(req: AuthRequest, res: Response) {
    try {
      const { title, description, price, category_id } = req.body;
      const seller_id = req.user?.id;
      const images = (req.files as Express.Multer.File[])?.map(file => file.path) || [];

      const result = await query(`
        INSERT INTO products (title, description, price, seller_id, category_id, images, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'active')
        RETURNING *
      `, [title, description, price, seller_id, category_id, images]);

      res.status(201).json({
        status: 'success',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Erreur lors de la création du produit:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la création du produit'
      });
    }
  },

  async updateProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, price, category_id, status } = req.body;
      const seller_id = req.user?.id;

      // Vérifier que le vendeur est propriétaire du produit
      const product = await query('SELECT * FROM products WHERE id = $1', [id]);
      if (product.rows[0].seller_id !== seller_id) {
        res.status(403).json({
          status: 'error',
          message: 'Non autorisé à modifier ce produit'
        });
        return;
      }

      const newImages = (req.files as Express.Multer.File[])?.map(file => file.path);
      const currentImages = product.rows[0].images;
      const images = newImages ? [...currentImages, ...newImages] : currentImages;

      const result = await query(`
        UPDATE products
        SET title = $1, description = $2, price = $3, category_id = $4, images = $5, status = $6, updated_at = CURRENT_TIMESTAMP
        WHERE id = $7 AND seller_id = $8
        RETURNING *
      `, [title, description, price, category_id, images, status, id, seller_id]);

      if (result.rows.length === 0) {
        res.status(404).json({
          status: 'error',
          message: 'Produit non trouvé'
        });
        return;
      }

      res.json({
        status: 'success',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du produit:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la mise à jour du produit'
      });
    }
  },

  async deleteProduct(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const seller_id = req.user?.id;

      const result = await query(
        'DELETE FROM products WHERE id = $1 AND seller_id = $2 RETURNING id',
        [id, seller_id]
      );

      if (result.rows.length === 0) {
        res.status(404).json({
          status: 'error',
          message: 'Produit non trouvé ou non autorisé'
        });
        return;
      }

      res.json({
        status: 'success',
        message: 'Produit supprimé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression du produit:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la suppression du produit'
      });
    }
  },

  async getCategories(_: AuthRequest, res: Response) {
    try {
      const result = await query('SELECT * FROM categories ORDER BY name');
      res.json({
        status: 'success',
        data: result.rows
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des catégories:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la récupération des catégories'
      });
    }
  },

  async searchProducts(req: AuthRequest, res: Response) {
    try {
      const { q } = req.query;
      const result = await query(`
        SELECT p.*, u.name as seller_name, c.name as category_name
        FROM products p
        JOIN users u ON p.seller_id = u.id
        JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'active'
        AND (
          p.title ILIKE $1
          OR p.description ILIKE $1
          OR c.name ILIKE $1
        )
        ORDER BY p.created_at DESC
      `, [`%${q}%`]);

      res.json({
        status: 'success',
        data: result.rows
      });
      return;
    } catch (error) {
      logger.error('Erreur lors de la recherche de produits:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la recherche de produits'
      });
      return;
    }
  },

  async getSellerProducts(req: AuthRequest, res: Response) {
    try {
      const seller_id = req.user?.id;
      const result = await query(`
        SELECT p.*, c.name as category_name
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.seller_id = $1
        ORDER BY p.created_at DESC
      `, [seller_id]);

      res.json({
        status: 'success',
        data: result.rows
      });
      return;
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits du vendeur:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la récupération des produits'
      });
      return;
    }
  },

  async toggleFavorite(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;

      // Vérifier si le produit est déjà en favori
      const favorite = await query(
        'SELECT * FROM product_favorites WHERE product_id = $1 AND user_id = $2',
        [id, user_id]
      );

      if (favorite.rows.length > 0) {
        // Supprimer des favoris
        await query(
          'DELETE FROM product_favorites WHERE product_id = $1 AND user_id = $2',
          [id, user_id]
        );
        res.json({
          status: 'success',
          message: 'Produit retiré des favoris'
        });
        return;
      } else {
        // Ajouter aux favoris
        await query(
          'INSERT INTO product_favorites (product_id, user_id) VALUES ($1, $2)',
          [id, user_id]
        );
        res.json({
          status: 'success',
          message: 'Produit ajouté aux favoris'
        });
        return;
      }
    } catch (error) {
      logger.error('Erreur lors de la gestion des favoris:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la gestion des favoris'
      });
      return;
    }
  },

  async getSellerOrders(_: AuthRequest, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Récupération des commandes vendeur non implémentée.'
    });
    return;
  },

  async updateOrderStatus(_: AuthRequest, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Mise à jour du statut de commande non implémentée.'
    });
    return;
  },

  async createOrder(_: AuthRequest, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Création de commande non implémentée.'
    });
    return;
  },

  async getBuyerOrders(_: AuthRequest, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Récupération des commandes acheteur non implémentée.'
    });
    return;
  },

  async getOrder(_: AuthRequest, res: Response) {
    res.status(501).json({
      status: 'error',
      message: 'Récupération de la commande non implémentée.'
    });
    return;
  }
}; 