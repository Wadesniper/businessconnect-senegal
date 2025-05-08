export interface Formateur {
  id: string;
  nom: string;
  titre: string;
  bio: string;
  photo?: string;
  specialites: string[];
  experiences: {
    poste: string;
    entreprise: string;
    debut: string;
    fin?: string;
  }[];
  certifications: {
    nom: string;
    organisme: string;
    date: string;
  }[];
}

export interface Module {
  id: string;
  titre: string;
  description: string;
  duree: string;
  contenu: string[];
  ressources?: {
    type: 'video' | 'document' | 'quiz';
    titre: string;
    url: string;
  }[];
}

export interface Formation {
  id: string;
  titre: string;
  description: string;
  niveau: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  duree: string;
  prix: number;
  categorie: string;
  image: string;
  formateur: Formateur;
  note: number;
  nombreInscrits: number;
  tags: string[];
  dateCreation: string;
  dateMiseAJour: string;
  objectifs: string[];
  prerequis: string[];
  programme: Module[];
  inclus: string[];
  certifiant: boolean;
  certificat?: {
    nom: string;
    description: string;
    validite: string;
  };
  prochaineSessions?: {
    debut: string;
    fin: string;
    places: number;
    modalite: 'presentiel' | 'distanciel' | 'hybride';
  }[];
  avis?: {
    id: string;
    auteur: {
      nom: string;
      photo?: string;
    };
    note: number;
    commentaire: string;
    date: string;
  }[];
}

export interface FormationFilters {
  categorie?: string;
  niveau?: Formation['niveau'];
  prix?: {
    min?: number;
    max?: number;
  };
  duree?: {
    min?: number;
    max?: number;
  };
  modalite?: 'presentiel' | 'distanciel' | 'hybride';
  certifiant?: boolean;
  searchTerm?: string;
  tri?: 'popularite' | 'recent' | 'prix-asc' | 'prix-desc' | 'note';
  page?: number;
  limit?: number;
}

export interface FormationPageProps {
  isSubscribed: boolean;
}

export interface InscriptionFormation {
  id: string;
  formationId: string;
  userId: string;
  dateInscription: string;
  statut: 'en_cours' | 'termine' | 'abandonne';
  progression: number;
  dateDebut?: string;
  dateFin?: string;
  certificatObtenu?: boolean;
  dateCertificat?: string;
  noteFinale?: number;
  commentaire?: string;
}

export interface Categorie {
  id: string;
  nom: string;
  description: string;
  icone: string;
  nombreFormations: number;
  sousCategories?: Omit<Categorie, 'sousCategories'>[];
}

export interface FormationResponse {
  formations: Formation[];
  total: number;
  page: number;
  pageSize: number;
}

export type NiveauFormation = 'Débutant' | 'Intermédiaire' | 'Avancé';

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
  | 'Cloud Computing'; 