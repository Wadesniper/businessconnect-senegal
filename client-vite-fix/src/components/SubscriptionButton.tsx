import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SubscriptionButtonProps {
  subscriptionType: string;
  label: string;
}

export const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  subscriptionType,
  label
}) => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubscription = async () => {
    try {
      if (!user) {
        navigate('/login');
        return;
      }

      setLoading(true);

      const response = await fetch('/api/subscriptions/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          subscriptionType,
          customer_name: user.lastName,
          customer_surname: user.firstName,
          customer_email: user.email || '',
          customer_phone_number: user.phone,
          customer_address: 'Dakar',
          customer_city: 'Dakar',
          customer_country: 'SN',
          customer_state: 'DK',
          customer_zip_code: '12000'
        })
      });

      const data = await response.json();

      if (response.ok && data.paymentUrl) {
        // Rediriger vers l'interface de paiement CinetPay
        window.location.href = data.paymentUrl;
      } else {
        throw new Error(data.error || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // TODO: Afficher un message d'erreur à l'utilisateur
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleSubscription}
      disabled={loading}
      sx={{ 
        minWidth: 200,
        position: 'relative'
      }}
    >
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      ) : label}
    </Button>
  );
}; 