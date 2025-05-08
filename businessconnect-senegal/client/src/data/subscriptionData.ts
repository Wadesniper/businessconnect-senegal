// Données statiques pour les abonnements utilisateurs
export interface UserSubscription {
  userId: string;
  isActive: boolean;
  expiresAt: string; // ISO string
}

export const subscriptionData: UserSubscription[] = [
  {
    userId: 'user1',
    isActive: true,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() // 30 jours
  },
  {
    userId: 'user2',
    isActive: false,
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // expiré hier
  },
  {
    userId: 'user3',
    isActive: true,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString() // 10 jours
  }
]; 