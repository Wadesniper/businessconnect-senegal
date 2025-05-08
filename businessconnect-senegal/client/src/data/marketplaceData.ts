// Données statiques pour la marketplace
import { MarketplaceItem } from '../services/marketplaceService';

export const marketplaceData: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Ordinateur portable HP',
    description: 'Ordinateur portable HP 15 pouces, 8Go RAM, 256Go SSD, très bon état.',
    price: 250000,
    category: 'Informatique',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c'
    ],
    location: 'Dakar',
    contactInfo: {
      email: 'vendeur1@email.com',
      phone: '771234567'
    },
    userId: 'user1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '2',
    title: 'Robe de soirée',
    description: 'Robe de soirée rouge, taille M, portée une seule fois.',
    price: 35000,
    category: 'Mode',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f'
    ],
    location: 'Thiès',
    contactInfo: {
      email: 'vendeuse2@email.com',
      phone: '781234567'
    },
    userId: 'user2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: '3',
    title: 'Service de réparation smartphone',
    description: "Réparation rapide de smartphones toutes marques, pièces d'origine.",
    price: 10000,
    category: 'Services',
    images: [
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308'
    ],
    location: 'Saint-Louis',
    contactInfo: {
      email: 'service3@email.com',
      phone: '761234567'
    },
    userId: 'user3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  }
]; 