import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Subscription, SubscriptionType, PaymentInitiation } from '../types/subscription';
import { api } from '../services/api';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const fetchSubscription = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/subscriptions/${user.id}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'abonnement');
      }
      const data = await response.json();
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

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

  const checkSubscriptionStatus = async () => {
    if (!user?.id || !subscription) return;
    
    try {
      const response = await fetch(`/api/subscriptions/${user.id}/status`);
      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du statut');
      }
      const updatedSubscription = await response.json();
      setSubscription(updatedSubscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const refreshSubscription = () => {
    fetchSubscription();
  };

  useEffect(() => {
    if (user?.id) {
      fetchSubscription();
    }
  }, [user?.id]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setHasActiveSubscription(false);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/subscription/status');
        setHasActiveSubscription(response.data.hasActiveSubscription);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'abonnement:', error);
        setHasActiveSubscription(false);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user]);

  return {
    subscription,
    loading,
    error,
    initiateSubscription,
    checkSubscriptionStatus,
    refreshSubscription,
    hasActiveSubscription
  };
}; 