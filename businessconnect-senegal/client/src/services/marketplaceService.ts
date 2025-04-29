import { api } from './api';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  location: string;
  contactInfo: {
    email: string;
    phone?: string;
  };
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'sold' | 'expired';
}

export interface MarketplaceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  location?: string;
}

export const marketplaceService = {
  async getItems(filters?: MarketplaceFilters): Promise<MarketplaceItem[]> {
    try {
      const response = await api.get('/marketplace', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des annonces:', error);
      throw error;
    }
  },

  async getItem(id: string): Promise<MarketplaceItem | null> {
    try {
      const response = await api.get(`/marketplace/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'annonce:', error);
      return null;
    }
  },

  async createItem(itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<MarketplaceItem | null> {
    try {
      const response = await api.post('/marketplace', itemData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'annonce:', error);
      throw error;
    }
  },

  async updateItem(id: string, itemData: Partial<MarketplaceItem>): Promise<MarketplaceItem | null> {
    try {
      const response = await api.put(`/marketplace/${id}`, itemData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'annonce:', error);
      throw error;
    }
  },

  async deleteItem(id: string): Promise<boolean> {
    try {
      await api.delete(`/marketplace/${id}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'annonce:', error);
      return false;
    }
  },

  async uploadImage(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/marketplace/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.url;
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      throw error;
    }
  }
}; 