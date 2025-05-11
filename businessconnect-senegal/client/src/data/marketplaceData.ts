export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  seller: string;
  image: string;
  category: string;
  createdAt: string;
}

export const marketplaceData: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Coaching carrière',
    description: 'Séance de coaching individuel pour booster votre carrière au Sénégal.',
    price: 15000,
    currency: 'XOF',
    seller: 'Fatou Ndiaye',
    image: '/images/marketplace/coaching.jpg',
    category: 'Services',
    createdAt: '2024-05-01',
  },
  {
    id: '2',
    title: 'CV Professionnel',
    description: 'Création de CV moderne et adapté au marché sénégalais.',
    price: 8000,
    currency: 'XOF',
    seller: 'Mamadou Diop',
    image: '/images/marketplace/cv.jpg',
    category: 'Services',
    createdAt: '2024-05-02',
  },
  {
    id: '3',
    title: 'Pack Formation Excel',
    description: 'Accès à une formation complète sur Excel pour débutants et avancés.',
    price: 12000,
    currency: 'XOF',
    seller: 'Awa Ba',
    image: '/images/marketplace/excel.jpg',
    category: 'Formations',
    createdAt: '2024-05-03',
  },
  // Ajoutez d'autres exemples selon les besoins
]; 