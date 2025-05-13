import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SubscriptionCancelPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 4 }} />
      
      <Typography variant="h3" component="h1" gutterBottom>
        Paiement non complété
      </Typography>
      
      <Typography variant="h6" color="text.secondary" paragraph>
        Le paiement n'a pas pu être complété. Aucun montant n'a été débité de votre compte.
      </Typography>

      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate('/subscription')}
        >
          Réessayer
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          size="large"
          onClick={() => navigate('/contact')}
        >
          Contacter le support
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        Si vous pensez qu'il s'agit d'une erreur ou si vous avez besoin d'aide,
        n'hésitez pas à contacter notre équipe de support.
      </Typography>
    </Container>
  );
};

export default SubscriptionCancelPage; 