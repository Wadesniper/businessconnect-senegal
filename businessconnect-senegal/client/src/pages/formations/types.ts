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