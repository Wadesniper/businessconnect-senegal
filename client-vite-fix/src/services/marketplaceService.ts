import { marketplaceData } from '../data/marketplaceData';
import { subscriptionData } from '../data/subscriptionData';
import type { UserSubscription } from '../data/subscriptionData';
import api from './api';
import { authService } from './authService';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  location: string;
  contactEmail?: string;
  contactPhone: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'sold' | 'expired';
}

export interface MarketplaceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
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

export const marketplaceService = {
  async getItems(filters?: MarketplaceFilters): Promise<MarketplaceItem[]> {
    const params: any = {};
    if (filters?.category) params.category = filters.category;
    if (filters?.search) params.query = filters.search;
    // Ajout d'autres filtres si besoin
    const res = await api.get<MarketplaceItem[]>('/api/marketplace', { params });
    return res.data;
  },

  async getItem(id: string): Promise<MarketplaceItem | null> {
    const res = await api.get<MarketplaceItem>(`/api/marketplace/${id}`);
    return res.data;
  },

  async createItem(itemData: any): Promise<MarketplaceItem> {
    // Logs temporaires pour debug
    const token = authService.getToken();
    console.log('[MARKETPLACE DEBUG] Token disponible:', !!token);
    console.log('[MARKETPLACE DEBUG] Token:', token);
    console.log('[MARKETPLACE DEBUG] Données à envoyer:', itemData);
    
    const res = await api.post<MarketplaceItem>('/api/marketplace', itemData);
    console.log('[MARKETPLACE DEBUG] Réponse reçue:', res.data);
    return res.data;
  },

  async updateItem(id: string, itemData: Partial<MarketplaceItem>): Promise<MarketplaceItem> {
    const res = await api.put<MarketplaceItem>(`/api/marketplace/${id}`, itemData);
    return res.data;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/api/marketplace/${id}`);
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<{url: string}>('/api/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data.url;
  }
}; 