import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { SubscriptionType, PaymentInitiation } from '../types/subscription';
import { subscriptionService } from '../services/subscriptionService';
import { endpoints } from '../config/api';
import { api } from '../services/api';

export const useSubscription = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const token = localStorage.getItem('token');

  const initiateSubscription = async (type: SubscriptionType): Promise<PaymentInitiation> => {
    if (!user?.id) {
      throw new Error('Utilisateur non connecté');
    }

    console.log('Token disponible:', !!token);
    console.log('User ID:', user.id);

    const payload: any = {
      userId: user.id,
      subscriptionType: type,
      customer_name: user.firstName || '',
      customer_surname: user.lastName || '',
      customer_phone_number: user.phoneNumber || ''
    };
    if (user.email) payload.customer_email = user.email;
    
    console.log('Initiation abonnement:', payload);
    
    try {
      const response = await api.post('/api/subscriptions/initiate', payload);
      console.log('Réponse serveur abonnement:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur serveur abonnement:', error);
      
      let errorMsg = 'Erreur lors de l\'initiation du paiement';
      if (error.response?.data?.error) {
        errorMsg = error.response.data.error;
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      throw new Error(errorMsg);
    }
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
        // Gérer silencieusement les erreurs d'abonnement
        // C'est normal qu'un nouvel utilisateur n'ait pas d'abonnement
        setHasActiveSubscription(false);
        setError(null); // Ne pas afficher d'erreur
        console.log('Pas d\'abonnement actif (normal pour un nouvel utilisateur)');
      } finally {
        setLoading(false);
      }
    };
    
    // Attendre un peu avant de vérifier pour éviter les appels lors du chargement initial
    const timer = setTimeout(checkStatus, 1000);
    return () => clearTimeout(timer);
  }, [user?.id, user?.role]);

  return {
    loading,
    error,
    initiateSubscription,
    hasActiveSubscription
  };
}; 