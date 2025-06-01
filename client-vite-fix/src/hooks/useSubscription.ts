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
    
    console.log('Initiation abonnement:', payload);
    
    const response = await fetch(`${endpoints.subscriptions}/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });

    console.log('Réponse serveur abonnement:', response.status);

    if (!response.ok) {
      let errorMsg = 'Erreur lors de l\'initiation du paiement';
      try {
        const errorData = await response.json();
        console.error('Erreur serveur abonnement:', errorData);
        if (errorData && errorData.error) errorMsg = errorData.error;
      } catch {}
      throw new Error(errorMsg);
    }

    const result = await response.json();
    console.log('Résultat abonnement:', result);
    return result;
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