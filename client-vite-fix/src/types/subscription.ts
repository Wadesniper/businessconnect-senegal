// Les abonnements sont tous mensuels (30 jours)
export type SubscriptionType = 'etudiant' | 'annonceur' | 'recruteur';

export interface Subscription {
  id: string;
  userId: string;
  type: SubscriptionType;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  lastPaymentDate: string;
  nextPaymentDate: string;
}

export interface PaymentInitiation {
  paymentUrl: string;
  transactionId: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

export interface SubscriptionPricing {
  etudiant: number;
  annonceur: number;
  recruteur: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  type: SubscriptionType;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  lastPaymentDate: string;
  nextPaymentDate: string;
} 