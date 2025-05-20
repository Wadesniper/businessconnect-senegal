export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  seller: string;
  images: string[];
  location: string;
  contactInfo: { email: string; phone?: string };
  userId: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'sold' | 'expired';
}

export const marketplaceData: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Coaching carrière',
    description: 'Séance de coaching individuel pour booster votre carrière au Sénégal.',
    price: 15000,
    currency: 'XOF',
    seller: 'Fatou Ndiaye',
    images: ['/images/marketplace/coaching.jpg'],
    location: 'Dakar',
    contactInfo: { email: 'fatou.ndiaye@email.com' },
    userId: '1',
    category: 'Services',
    createdAt: '2024-05-01',
    updatedAt: '2024-05-01',
    status: 'active',
  },
  {
    id: '2',
    title: 'CV Professionnel',
    description: 'Création de CV moderne et adapté au marché sénégalais.',
    price: 8000,
    currency: 'XOF',
    seller: 'Mamadou Diop',
    images: ['/images/marketplace/cv.jpg'],
    location: 'Thiès',
    contactInfo: { email: 'mamadou.diop@email.com' },
    userId: '2',
    category: 'Services',
    createdAt: '2024-05-02',
    updatedAt: '2024-05-02',
    status: 'active',
  },
  {
    id: '3',
    title: 'Pack Formation Excel',
    description: 'Accès à une formation complète sur Excel pour débutants et avancés.',
    price: 12000,
    currency: 'XOF',
    seller: 'Awa Ba',
    images: ['/images/marketplace/excel.jpg'],
    location: 'Saint-Louis',
    contactInfo: { email: 'awa.ba@email.com' },
    userId: '3',
    category: 'Formations',
    createdAt: '2024-05-03',
    updatedAt: '2024-05-03',
    status: 'active',
  },
  // Ajoutez d'autres exemples selon les besoins
]; 