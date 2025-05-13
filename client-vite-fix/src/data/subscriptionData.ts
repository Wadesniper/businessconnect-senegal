export interface UserSubscription {
  userId: string;
  type: 'etudiant' | 'annonceur' | 'employeur';
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
}

export const subscriptionData: UserSubscription[] = [
  {
    userId: '1',
    type: 'etudiant',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2025-01-01',
    price: 1000,
    currency: 'XOF',
  },
  {
    userId: '2',
    type: 'annonceur',
    status: 'expired',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    price: 5000,
    currency: 'XOF',
  },
  {
    userId: '3',
    type: 'employeur',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2025-02-01',
    price: 9000,
    currency: 'XOF',
  },
]; 