import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';

const subscriptionPlans = [
  {
    id: 'etudiant',
    title: 'Étudiant / Chercheur d\'emploi',
    price: '1000',
    period: 'mois',
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
    price: '5000',
    period: 'mois',
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
    price: '9000',
    period: 'mois',
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
  const { hasActiveSubscription, initiateSubscription } = useSubscription();

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      window.location.href = `/auth/login?redirect=${window.location.pathname}`;
      return;
    }

    try {
      const { paymentUrl } = await initiateSubscription(planId);
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Erreur lors de l\'initiation du paiement:', error);
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
          <Grid item key={plan.id} xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                ...(plan.recommended && {
                  border: '2px solid',
                  borderColor: 'primary.main'
                })
              }}
            >
              {plan.recommended && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1
                  }}
                >
                  Recommandé
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {plan.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                  <Typography variant="h3" component="span">
                    {parseInt(plan.price).toLocaleString()} FCFA
                  </Typography>
                  <Typography variant="subtitle1" component="span" ml={1}>
                    /{plan.period}
                  </Typography>
                </Box>
                <List>
                  {plan.features.map((feature, index) => (
                    <ListItem key={index} disableGutters>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  variant={plan.recommended ? 'contained' : 'outlined'}
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={hasActiveSubscription}
                >
                  {hasActiveSubscription ? 'Déjà abonné' : 'Choisir ce plan'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" paragraph>
          Paiement sécurisé via Orange Money, Wave et cartes bancaires
        </Typography>
        <Typography variant="body2" color="text.secondary">
          En vous abonnant, vous acceptez nos conditions générales d'utilisation
        </Typography>
      </Box>
    </Container>
  );
};

export default SubscriptionPage; 