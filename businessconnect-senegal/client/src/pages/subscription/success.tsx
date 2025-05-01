import React, { useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../../hooks/useSubscription';

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();

  useEffect(() => {
    // Rafraîchir l'état de l'abonnement
    refreshSubscription();
  }, [refreshSubscription]);

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 4 }} />
      
      <Typography variant="h3" component="h1" gutterBottom>
        Paiement réussi !
      </Typography>
      
      <Typography variant="h6" color="text.secondary" paragraph>
        Votre abonnement a été activé avec succès. Vous pouvez maintenant accéder à toutes nos formations.
      </Typography>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/formations')}
        >
          Voir les formations
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate('/account')}
        >
          Mon compte
        </Button>
      </Box>
    </Container>
  );
};

export default SubscriptionSuccessPage; 