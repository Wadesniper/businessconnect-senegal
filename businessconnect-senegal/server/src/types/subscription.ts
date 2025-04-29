export type SubscriptionType = 'etudiant' | 'annonceur' | 'recruteur';
export type SubscriptionStatus = 'active' | 'pending' | 'expired';

export interface Subscription {
  id: string;
  userId: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  paymentId?: string;
  transactionId?: string;
}

export interface PaymentInitiation {
  redirectUrl: string;
  paymentId: string;
}

export interface PaymentData {
  amount: number;
  description: string;
  customField: string;
  item_name: string;
  item_price: number;
  currency: string;
  ref_command: string;
  command_name: string;
} 