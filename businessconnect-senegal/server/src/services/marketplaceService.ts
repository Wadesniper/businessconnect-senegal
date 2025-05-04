import { logger } from '../utils/logger';
import { Product, IProduct } from '../models/product';
import { Category, ICategory } from '../models/category';
import { Schema } from 'mongoose';

export class MarketplaceService {
  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    try {
      const product = new Product(data);
      await product.save();
      return product;
    } catch (error) {
      logger.error('Erreur lors de la création du produit:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<IProduct | null> {
    try {
      return await Product.findById(id)
        .populate('seller', 'name email avatar')
        .populate('category', 'name slug');
    } catch (error) {
      logger.error('Erreur lors de la récupération du produit:', error);
      throw error;
    }
  }

  async updateProduct(id: string, sellerId: string, data: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const product = await Product.findOneAndUpdate(
        { _id: id, seller: sellerId },
        { ...data, updatedAt: new Date() },
        { new: true }
      )
        .populate('seller', 'name email avatar')
        .populate('category', 'name slug');
      return product;
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du produit:', error);
      throw error;
    }
  }

  async deleteProduct(id: string, sellerId: string): Promise<boolean> {
    try {
      const result = await Product.deleteOne({ _id: id, seller: sellerId });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error('Erreur lors de la suppression du produit:', error);
      throw error;
    }
  }

  async searchProducts(query: string): Promise<IProduct[]> {
    try {
      return await Product.find({
        $and: [
          { status: 'active' },
          {
            $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { tags: { $regex: query, $options: 'i' } }
            ]
          }
        ]
      })
        .populate('seller', 'name email avatar')
        .populate('category', 'name slug');
    } catch (error) {
      logger.error('Erreur lors de la recherche de produits:', error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: string): Promise<IProduct[]> {
    try {
      return await Product.find({ category: categoryId, status: 'active' })
        .populate('seller', 'name email avatar')
        .populate('category', 'name slug');
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits par catégorie:', error);
      throw error;
    }
  }

  async getProductsBySeller(sellerId: string): Promise<IProduct[]> {
    try {
      return await Product.find({ seller: sellerId })
        .populate('seller', 'name email avatar')
        .populate('category', 'name slug');
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits du vendeur:', error);
      throw error;
    }
  }

  async toggleFavorite(productId: string, userId: string): Promise<boolean> {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return false;
      }

      const userIdObj = new Schema.Types.ObjectId(userId);
      const favoriteIndex = product.favorites.indexOf(userIdObj);

      if (favoriteIndex === -1) {
        product.favorites.push(userIdObj);
      } else {
        product.favorites.splice(favoriteIndex, 1);
      }

      await product.save();
      return true;
    } catch (error) {
      logger.error('Erreur lors de la modification des favoris:', error);
      throw error;
    }
  }

  async getFavoriteProducts(userId: string): Promise<IProduct[]> {
    try {
      return await Product.find({ favorites: userId })
        .populate('seller', 'name email avatar')
        .populate('category', 'name slug');
    } catch (error) {
      logger.error('Erreur lors de la récupération des produits favoris:', error);
      throw error;
    }
  }

  // Méthodes pour les catégories
  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    try {
      const category = new Category(data);
      await category.save();
      return category;
    } catch (error) {
      logger.error('Erreur lors de la création de la catégorie:', error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    try {
      return await Category.findById(id);
    } catch (error) {
      logger.error('Erreur lors de la récupération de la catégorie:', error);
      throw error;
    }
  }

  async updateCategory(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    try {
      return await Category.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      logger.error('Erreur lors de la mise à jour de la catégorie:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await Category.deleteOne({ _id: id });
      return result.deletedCount > 0;
    } catch (error) {
      logger.error('Erreur lors de la suppression de la catégorie:', error);
      throw error;
    }
  }

  async getAllCategories(): Promise<ICategory[]> {
    try {
      return await Category.find({ isActive: true }).sort('order');
    } catch (error) {
      logger.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  }

  async getCategoryBySlug(slug: string): Promise<ICategory | null> {
    try {
      return await Category.findOne({ slug, isActive: true });
    } catch (error) {
      logger.error('Erreur lors de la récupération de la catégorie par slug:', error);
      throw error;
    }
  }
} 