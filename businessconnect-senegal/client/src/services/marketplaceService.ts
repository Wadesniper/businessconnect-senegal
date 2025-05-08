import { marketplaceData } from '../data/marketplaceData';
import { subscriptionData, UserSubscription } from '../data/subscriptionData';

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

const STORAGE_KEY = 'marketplace_items';

function getStoredItems(): MarketplaceItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  // Si rien en localStorage, on initialise avec les données statiques
  localStorage.setItem(STORAGE_KEY, JSON.stringify(marketplaceData));
  return [...marketplaceData];
}

function saveItems(items: MarketplaceItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function getUserSubscription(userId: string): UserSubscription | undefined {
  // On peut aussi stocker les abonnements dans le localStorage si besoin
  return subscriptionData.find(sub => sub.userId === userId);
}

function isUserSubscribed(userId: string): boolean {
  const sub = getUserSubscription(userId);
  if (!sub) return false;
  if (!sub.isActive) return false;
  if (new Date(sub.expiresAt) < new Date()) return false;
  return true;
}

export const marketplaceService = {
  async getItems(filters?: MarketplaceFilters): Promise<MarketplaceItem[]> {
    let items = getStoredItems();
    // Filtrer pour ne garder que les annonces dont le propriétaire est abonné
    items = items.filter(i => isUserSubscribed(i.userId));
    if (filters) {
      if (filters.category) items = items.filter(i => i.category === filters.category);
      if (filters.location) items = items.filter(i => i.location.toLowerCase().includes(filters.location.toLowerCase()));
      if (filters.search) items = items.filter(i => i.title.toLowerCase().includes(filters.search.toLowerCase()) || i.description.toLowerCase().includes(filters.search.toLowerCase()));
      if (filters.minPrice !== undefined) items = items.filter(i => i.price >= filters.minPrice!);
      if (filters.maxPrice !== undefined) items = items.filter(i => i.price <= filters.maxPrice!);
    }
    return Promise.resolve(items);
  },

  async getItem(id: string): Promise<MarketplaceItem | null> {
    const items = getStoredItems();
    const item = items.find(i => i.id === id) || null;
    // Vérifier l'abonnement du propriétaire
    if (item && !isUserSubscribed(item.userId)) return null;
    return Promise.resolve(item);
  },

  async createItem(itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<MarketplaceItem> {
    // Vérifier l'abonnement de l'utilisateur
    if (!isUserSubscribed(itemData.userId)) {
      return Promise.reject(new Error('Votre abonnement n\'est pas actif. Veuillez vous abonner pour publier une annonce.'));
    }
    const items = getStoredItems();
    const newItem: MarketplaceItem = {
      ...itemData,
      id: (Date.now() + Math.random()).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };
    items.unshift(newItem);
    saveItems(items);
    return Promise.resolve(newItem);
  },

  async updateItem(id: string, itemData: Partial<MarketplaceItem>): Promise<MarketplaceItem> {
    const items = getStoredItems();
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Annonce non trouvée');
    const updated: MarketplaceItem = {
      ...items[idx],
      ...itemData,
      updatedAt: new Date().toISOString()
    };
    items[idx] = updated;
    saveItems(items);
    return Promise.resolve(updated);
  },

  async deleteItem(id: string): Promise<void> {
    let items = getStoredItems();
    items = items.filter(i => i.id !== id);
    saveItems(items);
    return Promise.resolve();
  },

  async uploadImage(file: File): Promise<string> {
    // Mock : retourne une URL d'image aléatoire Unsplash
    return Promise.resolve('https://source.unsplash.com/random/400x300?sig=' + Math.floor(Math.random()*10000));
  }
}; 