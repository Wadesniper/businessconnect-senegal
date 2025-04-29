export interface Subscription {
  id: string;
  userId: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
}

export type SubscriptionType = 'etudiant' | 'annonceur' | 'recruteur';
export type SubscriptionStatus = 'active' | 'pending' | 'expired';

export interface PaymentInitiation {
  paymentUrl: string;
  reference: string;
}

export interface SubscriptionPricing {
  etudiant: number;
  annonceur: number;
  recruteur: number;
} 