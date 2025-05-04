import { Document } from 'mongoose';

export enum NiveauFormation {
  DEBUTANT = 'DEBUTANT',
  INTERMEDIAIRE = 'INTERMEDIAIRE',
  AVANCE = 'AVANCE',
  EXPERT = 'EXPERT'
}

export enum StatutFormation {
  PLANIFIE = 'PLANIFIE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

export interface ContenuFormation {
  titre: string;
  description: string;
  duree: number; // en minutes
  ressources: string[];
  quiz?: {
    question: string;
    options: string[];
    reponseCorrecte: number;
  }[];
}

export interface Formateur {
  id: string;
  nom: string;
  prenom: string;
  specialite: string;
  bio: string;
}

export interface Participant {
  id: string;
  dateInscription: Date;
  progression: number;
}

export interface Evaluation {
  participantId: string;
  note: number;
  commentaire: string;
  date: Date;
}

export interface IFormation {
  id?: string;
  titre: string;
  description: string;
  niveau: NiveauFormation;
  prix: number;
  dureeTotal: number; // en heures
  dateDebut: Date;
  dateFin: Date;
  formateur: Formateur;
  contenu: ContenuFormation[];
  prerequis: string[];
  objectifs: string[];
  statut: StatutFormation;
  participants: Participant[];
  evaluations: Evaluation[];
  tags: string[];
  langue: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IFormationDocument extends IFormation, Document {
  ajouterParticipant(participantId: string): Promise<IFormationDocument>;
  mettreAJourProgression(participantId: string, progression: number): Promise<IFormationDocument>;
}

export interface StatistiquesFormation {
  nombreInscrits: number;
  tauxCompletion: number;
  noteMoyenne: number;
  nombreEvaluations: number;
  progression: {
    participantId: string;
    pourcentage: number;
  }[];
}

export interface CursaFormation {
  id: string;
  titre: string;
  description: string;
  url: string;
  categories: string[];
  niveau: string;
  prix: number;
  duree: number;
  langue: string;
  image?: string;
}

export interface FormationStats {
  vues: number;
  inscrits: number;
  completions: number;
}

export interface RechercheFormation {
  terme?: string;
  categorie?: string;
  niveau?: string;
  prixMin?: number;
  prixMax?: number;
  langue?: string;
  page?: number;
  limite?: number;
}

export interface FormationRequest {
  titre: string;
  description: string;
  niveau: NiveauFormation;
  prix: number;
  dureeTotal: number;
  dateDebut: Date;
  dateFin: Date;
  formateur: Formateur;
  contenu: ContenuFormation[];
  prerequis: string[];
  objectifs: string[];
  tags: string[];
  langue: string;
} 