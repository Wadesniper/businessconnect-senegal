import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SubscriptionType, PaymentInitiation } from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';
import { api } from '../services/api';

export const useSubscription = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const initiateSubscription = async (type: SubscriptionType): Promise<PaymentInitiation> => {
    // Vérifications robustes
    if (!isAuthenticated || !user?.id) {
      throw new Error('Utilisateur non connecté. Veuillez vous reconnecter.');
    }

    console.log('useSubscription - Initiation pour utilisateur:', {
      userId: user.id,
      type,
      hasToken: !!localStorage.getItem('token')
    });

    const payload = {
      userId: user.id,
      subscriptionType: type,
      customer_name: user.firstName || user.phoneNumber || 'Client',
      customer_surname: user.lastName || 'BusinessConnect',
      customer_phone_number: user.phoneNumber || '',
      ...(user.email && { customer_email: user.email })
    };
    
    try {
      const response = await api.post('/api/subscriptions/initiate', payload);
      
      console.log('useSubscription - Réponse serveur:', {
        status: 'success',
        hasPaymentUrl: !!(response.data as any)?.paymentUrl,
        transactionId: (response.data as any)?.transactionId
      });
      
      return response.data as PaymentInitiation;
    } catch (error: any) {
      console.error('useSubscription - Erreur:', {
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
        details: error.response?.data
      });
      
      let errorMsg = 'Erreur lors de l\'initiation du paiement';
      
      if (error.response?.status === 401) {
        errorMsg = 'Session expirée. Veuillez vous reconnecter.';
      } else if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      throw new Error(errorMsg);
    }
  };

  // Vérification du statut d'abonnement
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      // Attendre que l'objet utilisateur soit complètement chargé.
      if (!isAuthenticated || !user) {
        setHasActiveSubscription(false);
        setLoading(false);
        return;
      }

      // Si l'utilisateur est un admin, accorder l'accès et arrêter immédiatement.
      if (user.role === 'admin') {
        setHasActiveSubscription(true);
        setLoading(false);
        return;
      }

      // Pour les autres utilisateurs, vérifier l'abonnement en base de données.
      try {
        setLoading(true);
        setError(null);

        const isActive = await subscriptionService.fetchSubscriptionStatus(user.id);
        setHasActiveSubscription(isActive);

        console.log('useSubscription - Statut abonnement vérifié:', {
          userId: user.id,
          hasActiveSubscription: isActive
        });
      } catch (err: any) {
        // Une erreur 404 est normale si l'utilisateur n'a jamais souscrit.
        if (err.response?.status === 404) {
          setHasActiveSubscription(false);
          console.log('useSubscription - Pas d\'abonnement trouvé (normal pour un non-abonné).');
        } else {
          console.error('useSubscription - Erreur lors de la vérification du statut:', err);
          setError('Erreur lors de la vérification de l\'abonnement.');
          setHasActiveSubscription(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
    
  }, [isAuthenticated, user]); // Dépendre de l'objet 'user' entier.

  // Ajout d'une méthode pour rafraîchir le statut d'abonnement à la demande
  const refreshSubscription = async () => {
    if (!isAuthenticated || !user?.id) {
      setHasActiveSubscription(false);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const isActive = await subscriptionService.fetchSubscriptionStatus(user.id);
      setHasActiveSubscription(isActive);
    } catch (err: any) {
      setHasActiveSubscription(false);
      setError('Erreur lors de la vérification de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    initiateSubscription,
    hasActiveSubscription,
    refreshSubscription
  };
}; 