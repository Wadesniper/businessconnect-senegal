export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  subscription?: Subscription;
}

export interface Subscription {
  id: string;
  userId: string;
  type: 'etudiant' | 'annonceur' | 'recruteur';
  status: 'active' | 'pending' | 'expired';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
} 