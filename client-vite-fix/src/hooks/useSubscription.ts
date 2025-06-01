import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SubscriptionType, PaymentInitiation } from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';
import { endpoints } from '../config/api';

export const useSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const token = localStorage.getItem('auth_token');

  const initiateSubscription = async (type: SubscriptionType): Promise<PaymentInitiation> => {
    if (!user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    const payload: any = {
      userId: user.id,
      subscriptionType: type,
      customer_name: user.firstName || '',
      customer_surname: user.lastName || '',
      customer_phone_number: user.phoneNumber || ''
    };
    if (user.email) payload.customer_email = user.email;
    const response = await fetch(`${endpoints.subscriptions}/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMsg = 'Erreur lors de l\'initiation du paiement';
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) errorMsg = errorData.error;
      } catch {}
      throw new Error(errorMsg);
    }

    return response.json();
  };

  // Vérification dynamique du statut d'abonnement via l'API backend
  useEffect(() => {
    const checkStatus = async () => {
      setLoading(true);
      setError(null); // Réinitialiser l'erreur
      
      if (!user?.id) {
        setHasActiveSubscription(false);
        setLoading(false);
        return;
      }
      
      if (user?.role === 'admin') {
        setHasActiveSubscription(true);
        setLoading(false);
        return;
      }
      
      try {
        const isActive = await subscriptionService.fetchSubscriptionStatus(user.id);
        setHasActiveSubscription(isActive);
      } catch (err: any) {
        // On ne définit pas d'erreur pour un 404 ou un problème d'abonnement
        // car c'est normal pour un nouvel utilisateur
        setHasActiveSubscription(false);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkStatus();
  }, [user?.id, user?.role]);

  return {
    loading,
    error,
    initiateSubscription,
    hasActiveSubscription
  };
}; 