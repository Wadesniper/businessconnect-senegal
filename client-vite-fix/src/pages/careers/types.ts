export interface Competence {
  nom: string;
  niveau: 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
  description?: string;
}

export interface PlagesSalariales {
  junior: {
    min: number;
    max: number;
  };
  confirme: {
    min: number;
    max: number;
  };
  senior: {
    min: number;
    max: number;
  };
}

export interface FicheMetier {
  id: string;
  titre: string;
  description: string;
  secteur: string;
  missions: string[];
  competencesRequises: Competence[];
  salaireMoyen: PlagesSalariales;
  formation: string[];
  perspectives: string[];
  environnementTravail: string[];
  tags: string[];
}

export interface Secteur {
  id: string;
  nom: string;
  description: string;
  icone: string;
  couleur: string;
  metiers: FicheMetier[];
} 