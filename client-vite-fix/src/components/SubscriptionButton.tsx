import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface SubscriptionButtonProps {
  userId: string;
  subscriptionType: 'etudiant' | 'annonceur' | 'recruteur';
  label: string;
}

export const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  userId,
  subscriptionType,
  label
}) => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleSubscription = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/subscriptions/initiate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subscriptionType
        })
      });

      const data = await response.json();

      if (data.success && data.data.redirectUrl) {
        // Rediriger vers l'interface de paiement CinetPay
        window.location.href = data.data.redirectUrl;
      } else {
        throw new Error(data.message || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Gérer l'erreur (afficher un message, etc.)
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