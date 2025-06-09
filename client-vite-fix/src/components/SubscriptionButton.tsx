import React from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface SubscriptionButtonProps {
  subscriptionType: string;
  label: string;
}

interface SubscriptionResponse {
  paymentUrl: string;
  error?: string;
}

export const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  subscriptionType,
  label
}) => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, refreshAuth } = useAuth();

  const handleSubscription = async () => {
    try {
      if (!isAuthenticated || !user) {
        navigate('/auth/login', { state: { from: '/subscription' } });
        return;
      }

      setLoading(true);

      // Rafraîchir l'état d'authentification avant de procéder
      await refreshAuth();

      const response = await api.post<SubscriptionResponse>('/api/subscriptions/initiate', {
        userId: user.id,
        subscriptionType,
        customer_name: user.firstName || '',
        customer_surname: user.lastName || '',
        customer_email: user.email || '',
        customer_phone_number: user.phoneNumber || '',
        customer_address: 'Dakar',
        customer_city: 'Dakar',
        customer_country: 'SN',
        customer_state: 'DK',
        customer_zip_code: '12000'
      });

      if (response.data?.paymentUrl) {
        // Rediriger vers l'interface de paiement PayTech
        console.log('Redirection vers PayTech:', response.data.paymentUrl);
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error(response.data?.error || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      
      // Gérer les erreurs d'authentification
      if (error.response?.status === 401) {
        message.error('Votre session a expiré. Veuillez vous reconnecter.');
        navigate('/auth/login', { state: { from: '/subscription' } });
      } else {
        // Afficher l'erreur à l'utilisateur
        message.error(error.response?.data?.message || error.message || 'Une erreur est survenue lors de l\'initiation du paiement');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="primary"
      onClick={handleSubscription}
      loading={loading}
      size="large"
      block
    >
      {label}
    </Button>
  );
}; 