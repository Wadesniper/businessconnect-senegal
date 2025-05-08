import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';

const subscriptionPlans = [
  {
    id: 'etudiant',
    title: 'Étudiant / Chercheur d\'emploi',
    price: '1 000 FCFA',
    period: '/ mois',
    features: [
      'Accès aux offres d\'emploi',
      'Espace CV',
      'Forum',
      'Fiches métiers',
      'Formations',
      'Support standard'
    ]
  },
  {
    id: 'annonceur',
    title: 'Annonceur',
    price: '5 000 FCFA',
    period: '/ mois',
    features: [
      'Publication d\'offres',
      'Visibilité plateforme',
      'Statistiques de vues',
      'Support prioritaire',
      'Badge "Annonceur Vérifié"',
      'Outils de promotion'
    ]
  },
  {
    id: 'recruteur',
    title: 'Recruteur',
    price: '9 000 FCFA',
    period: '/ mois',
    features: [
      'Accès CVthèque complète',
      'Contact direct candidats',
      'Publication offres illimitées',
      'Statistiques avancées',
      'Support dédié 24/7',
      'Outils de filtrage premium'
    ],
    recommended: true
  }
];

const SubscriptionPage = () => {
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      window.location.href = `/login?redirect=${window.location.pathname}`;
      return;
    }

    try {
      const response = await fetch('/api/subscriptions/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: planId,
          customer_name: user.firstName || '',
          customer_surname: user.lastName || '',
          customer_email: user.email,
          customer_phone_number: user.phone || ''
        })
      });

      const data = await response.json();

      if (data.success && data.data.payment_url) {
        window.location.href = data.data.payment_url;
      } else {
        throw new Error(data.error || 'Erreur lors de l\'initiation du paiement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Gérer l'erreur (afficher un message, etc.)
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom>
          Abonnement BusinessConnect
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Accédez à plus de 4000 formations en ligne avec certificats
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {subscriptionPlans.map((plan) => (
          <Grid item key={plan.id} xs={12} sm={6} md={4}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.2s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" textAlign="center">
                  {plan.title}
                </Typography>
                <Typography variant="h4" component="p" textAlign="center" color="primary" gutterBottom>
                  {plan.price}
                  <Typography variant="subtitle1" component="span" color="text.secondary">
                    {plan.period}
                  </Typography>
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {plan.features.map((feature, index) => (
                    <Typography 
                      key={index} 
                      component="li" 
                      variant="body1" 
                      sx={{ mb: 1 }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={hasActiveSubscription}
                >
                  {hasActiveSubscription ? 'Déjà abonné' : 'S\'abonner'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionPage; 