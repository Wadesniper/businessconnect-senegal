import { marketplaceData } from '../data/marketplaceData';
import { subscriptionData } from '../data/subscriptionData';
import type { UserSubscription } from '../data/subscriptionData';
import api from './api';
import { authService } from './authService';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price?: number | null;
  priceType: 'fixed' | 'range' | 'negotiable';
  minPrice?: number | null;
  maxPrice?: number | null;
  category: string;
  images: string[];
  location: string;
  contactEmail?: string;
  contactPhone: string;
  userId: string;
  seller?: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface MarketplaceFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

const STORAGE_KEY = 'marketplace_items';

function getStoredItems(): MarketplaceItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  // Si rien en localStorage, on initialise avec les données statiques
  const staticData = marketplaceData.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    category: item.category,
    images: item.images,
    location: item.location,
    contactEmail: item.contactInfo?.email,
    contactPhone: item.contactInfo?.phone || '',
    userId: item.userId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    status: item.status as 'pending' | 'approved' | 'rejected' | 'active' | 'sold' | 'expired'
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(staticData));
  return [...staticData];
}

function saveItems(items: MarketplaceItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getUserSubscription(userId: string): UserSubscription | undefined {
  // On peut aussi stocker les abonnements dans le localStorage si besoin
  return subscriptionData.find(sub => sub.userId === userId);
}

function isUserSubscribed(userId: string, userContext?: any): boolean {
  // Priorité au user du contexte si fourni
  let user = userContext;
  if (!user) {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch {}
    }
  }
  if (user && user.role === 'admin') return true;
  const sub = getUserSubscription(userId);
  if (!sub) return false;
  if (sub.status !== 'active') return false;
  if (new Date(sub.endDate) < new Date()) return false;
  return true;
}

class MarketplaceService {
  async getItems(filters?: MarketplaceFilters): Promise<MarketplaceItem[]> {
    const response = await api.get<Partial<MarketplaceItem>[]>('/api/marketplace', {
      params: filters
    });
    return response.data.map((item: Partial<MarketplaceItem>) => ({
      ...item,
      priceType: item.priceType || 'fixed',
      price: item.price || null,
      minPrice: item.minPrice || null,
      maxPrice: item.maxPrice || null
    })) as MarketplaceItem[];
  }

  async getItem(id: string): Promise<MarketplaceItem | null> {
    const res = await api.get<MarketplaceItem>(`/api/marketplace/${id}`);
    return res.data;
  }

  async createItem(itemData: Partial<MarketplaceItem>): Promise<MarketplaceItem> {
    const token = authService.getToken();
    console.log('[MARKETPLACE DEBUG] Token disponible:', !!token);
    console.log('[MARKETPLACE DEBUG] Token:', token);
    
    // Formater les données avant l'envoi
    const { priceType, price, minPrice, maxPrice, seller, sellerId, ...rest } = itemData;
    
    // Nettoyer les URLs des images
    const cleanImages = Array.isArray(rest.images) 
      ? rest.images.map(url => url.replace(/[;,\s]+$/, '').trim())
      : [];

    const formattedData = {
      ...rest,
      priceType: priceType || 'fixed',
      price: priceType === 'fixed' ? Number(price) || 0 : null,
      minPrice: priceType === 'range' ? Number(minPrice) || 0 : null,
      maxPrice: priceType === 'range' ? Number(maxPrice) || 0 : null,
      images: cleanImages,
      sellerId: sellerId || seller, // Utiliser sellerId s'il existe, sinon utiliser seller
      status: 'pending',
      contactPhone: rest.contactPhone?.replace(/\s+/g, ''), // Supprimer les espaces du numéro de téléphone
      contactEmail: rest.contactEmail || ''
    };

    // Supprimer les champs undefined ou null
    Object.keys(formattedData).forEach(key => {
      if (formattedData[key] === undefined || formattedData[key] === null) {
        delete formattedData[key];
      }
    });

    console.log('[MARKETPLACE DEBUG] Données formatées à envoyer:', formattedData);

    const response = await api.post<MarketplaceItem>(
      `/api/marketplace`,
      formattedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  async updateItem(id: string, itemData: Partial<MarketplaceItem>): Promise<MarketplaceItem> {
    console.log('[DEBUG] Service - Début updateItem');
    console.log('[DEBUG] Service - ID:', id);
    
    try {
      // Formater les données avant l'envoi
      const { priceType, minPrice, maxPrice, ...rest } = itemData as any;
      const formattedData = {
        ...rest,
        priceType,
        // Gérer le prix selon le type
        price: priceType === 'fixed' ? Number(rest.price) : 
               priceType === 'range' ? null : 
               null,
        minPrice: priceType === 'range' ? Number(minPrice) : null,
        maxPrice: priceType === 'range' ? Number(maxPrice) : null,
        // Nettoyer les URLs des images
        images: Array.isArray(rest.images) ? rest.images.map((url: string) => url.replace(/;$/, '')) : [],
        // Ne pas changer le status lors d'une mise à jour
        status: rest.status || 'pending'
      };

      console.log('[DEBUG] Service - Données formatées:', formattedData);

      const res = await api.put<MarketplaceItem>(`/api/marketplace/${id}`, formattedData);
      console.log('[DEBUG] Service - Réponse:', res.data);
      return res.data;
    } catch (error) {
      console.error('[DEBUG] Service - Erreur:', error);
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/api/marketplace/${id}`);
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<{url: string}>('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  }
}

export const marketplaceService = new MarketplaceService(); 