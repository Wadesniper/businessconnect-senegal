import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { SubscriptionType, PaymentInitiation } from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';

export const useSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const initiateSubscription = async (type: SubscriptionType): Promise<PaymentInitiation> => {
    if (!user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    const response = await fetch('/api/subscriptions/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        subscriptionType: type
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'initiation du paiement');
    }

    return response.json();
  };

  // Vérification dynamique du statut d'abonnement via l'API backend
  useEffect(() => {
    const checkStatus = async () => {
      setLoading(true);
      if (!user?.id) {
        setHasActiveSubscription(false);
        setLoading(false);
        return;
      }
      try {
        const isActive = await subscriptionService.fetchSubscriptionStatus(user.id);
        setHasActiveSubscription(isActive);
      } catch (err) {
        setHasActiveSubscription(false);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, [user?.id]);

  return {
    loading,
    error,
    initiateSubscription,
    hasActiveSubscription
  };
}; 