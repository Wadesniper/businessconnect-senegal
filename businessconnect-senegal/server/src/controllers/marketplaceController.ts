import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { query } from '../config/database';
import { MarketplaceService } from '../services/marketplaceService';
import { AuthenticatedRequest, ApiResponse } from '../types/controllers';
import { Schema } from 'mongoose';
import { IProduct } from '../models/product';
import { ICategory } from '../models/category';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  seller_id: string;
  category_id: string;
  images: string[];
  status: 'active' | 'inactive' | 'sold';
  created_at: Date;
  updated_at: Date;
}

export class MarketplaceController {
  private marketplaceService: MarketplaceService;

  constructor() {
    this.marketplaceService = new MarketplaceService();
  }

  async getAllProducts(req: Request, res: Response) {
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
  }

  async getProduct(req: Request, res: Response) {
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
        return res.status(404).json({
          status: 'error',
          message: 'Produit non trouvé'
        });
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
  }

  async createProduct(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const productData = {
        ...req.body,
        seller: new Schema.Types.ObjectId(userId)
      };

      const product = await this.marketplaceService.createProduct(productData);
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Erreur lors de la création du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création du produit'
      });
    }
  }

  async updateProduct(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const product = await this.marketplaceService.updateProduct(
        req.params.id,
        userId,
        req.body
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour du produit'
      });
    }
  }

  async deleteProduct(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const success = await this.marketplaceService.deleteProduct(req.params.id, userId);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Produit supprimé avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression du produit:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression du produit'
      });
    }
  }

  async getCategories(req: Request, res: Response) {
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
  }

  async searchProducts(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Le terme de recherche est requis'
        });
      }

      const products = await this.marketplaceService.searchProducts(q as string);
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Erreur lors de la recherche de produits:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la recherche de produits'
      });
    }
  }

  async getSellerProducts(req: Request, res: Response) {
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
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits du vendeur:', error);
      res.status(500).json({
        status: 'error',
        message: 'Erreur lors de la récupération des produits'
      });
    }
  }

  async toggleFavorite(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const success = await this.marketplaceService.toggleFavorite(req.params.id, userId);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Produit non trouvé'
        });
      }

      res.json({
        success: true,
        message: 'Favoris mis à jour avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la modification des favoris:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la modification des favoris'
      });
    }
  }

  async getFavoriteProducts(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Non autorisé'
        });
      }

      const products = await this.marketplaceService.getFavoriteProducts(userId);
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits favoris:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des produits favoris'
      });
    }
  }

  async createCategory(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const category = await this.marketplaceService.createCategory(req.body);
      res.status(201).json({
        success: true,
        data: category
      });
    } catch (error) {
      logger.error('Erreur lors de la création de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la catégorie'
      });
    }
  }

  async getCategoryById(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const category = await this.marketplaceService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la catégorie'
      });
    }
  }

  async updateCategory(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const category = await this.marketplaceService.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la mise à jour de la catégorie'
      });
    }
  }

  async deleteCategory(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const success = await this.marketplaceService.deleteCategory(req.params.id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée'
        });
      }

      res.json({
        success: true,
        message: 'Catégorie supprimée avec succès'
      });
    } catch (error) {
      logger.error('Erreur lors de la suppression de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la catégorie'
      });
    }
  }

  async getAllCategories(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const categories = await this.marketplaceService.getAllCategories();
      res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération des catégories:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des catégories'
      });
    }
  }

  async getCategoryBySlug(req: AuthenticatedRequest, res: Response<ApiResponse>) {
    try {
      const category = await this.marketplaceService.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Catégorie non trouvée'
        });
      }

      res.json({
        success: true,
        data: category
      });
    } catch (error) {
      logger.error('Erreur lors de la récupération de la catégorie:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération de la catégorie'
      });
    }
  }
} 