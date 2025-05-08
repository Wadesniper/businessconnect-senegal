export interface DomaineFormation {
  id: string;
  titre: string;
  description: string;
  icone: string;
  url: string;
  nombreCours: number;
  categories?: string[];
}

export interface FormationPageProps {
  isSubscribed: boolean;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  level: string;
  isCertified: boolean;
  duration: string;
  enrolledCount: number;
  rating: number;
  price: number;
}

export type NiveauFormation = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert' | '';

export type CategorieFormation = 
  | 'Développement Web'
  | 'Marketing Digital'
  | 'Design'
  | 'Business'
  | 'Langues'
  | 'Data Science'
  | 'DevOps'
  | 'Mobile'
  | 'Cybersécurité'
  | 'Cloud Computing'
  | '';

export interface FormationFilters {
  page: number;
  limit: number;
  searchTerm?: string;
  categorie?: CategorieFormation;
  niveau?: NiveauFormation;
  prix?: {
    min: number;
    max: number;
  };
  tri: 'popularite' | 'recent' | 'prix-asc' | 'prix-desc' | 'note';
} 