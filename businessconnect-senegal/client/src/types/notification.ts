export interface Notification {
  id: string;
  userId: string;
  type: 'subscription_expiration' | 'new_offer' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
  data?: {
    subscriptionType?: string;
    daysRemaining?: number;
    action?: 'renewal' | 'view_offer';
    [key: string]: any;
  };
} 