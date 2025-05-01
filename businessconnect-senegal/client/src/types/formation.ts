export interface Formation {
  _id: string;
  title: string;
  description: string;
  category: 'développement' | 'business' | 'marketing' | 'design' | 'langues' | 'soft-skills';
  cursaUrl: string;
  thumbnail: string;
  price: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
} 