import React from 'react';
import { Box, Button, Card, CardContent, Container, Grid, Typography, useTheme } from '@mui/material';
import { School, Business, Work } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionButton } from './SubscriptionButton';

interface PlanProps {
  title: string;
  price: number;
  icon: React.ReactNode;
  features: string[];
  type: 'etudiant' | 'annonceur' | 'recruteur';
}

interface SubscriptionPlansProps {
  userId: string;
}

const SUBSCRIPTION_PLANS = [
  {
    type: 'etudiant',
    title: 'Plan Étudiant',
    price: '1,000 FCFA',
    description: 'Accès aux offres de stage et emploi',
    features: [
      'Postuler aux offres',
      'CV en ligne',
      'Alertes personnalisées'
    ]
  },
  {
    type: 'annonceur',
    title: 'Plan Annonceur',
    price: '5,000 FCFA',
    description: 'Publiez vos annonces et trouvez des talents',
    features: [
      'Publication d\'annonces',
      'Gestion des candidatures',
      'Statistiques détaillées',
      'Support prioritaire'
    ]
  },
  {
    type: 'recruteur',
    title: 'Plan Recruteur',
    price: '9,000 FCFA',
    description: 'Solution complète pour les recruteurs',
    features: [
      'Toutes les fonctionnalités Annonceur',
      'Recherche avancée de CV',
      'Contacts illimités',
      'Accompagnement personnalisé'
    ]
  }
] as const;

const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ userId }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const { initiateSubscription, currentSubscription, isLoading } = useSubscription();

  const handleSubscribe = async (type: 'etudiant' | 'annonceur' | 'recruteur') => {
    if (!user) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      window.location.href = '/login?redirect=/subscription';
      return;
    }
    
    try {
      const response = await initiateSubscription(type);
      // Rediriger vers la page de paiement PayTech
      window.location.href = response.redirectUrl;
    } catch (error) {
      console.error('Erreur lors de l\'initiation de l\'abonnement:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>
        Nos Plans d'Abonnement
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Choisissez le plan qui correspond le mieux à vos besoins
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Grid item xs={12} sm={6} md={4} key={plan.type}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {plan.title}
                </Typography>
                <Typography variant="h4" color="primary" gutterBottom>
                  {plan.price}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                  {plan.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {plan.features.map((feature, index) => (
                    <Typography 
                      key={index}
                      variant="body2"
                      sx={{ 
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        '&:before': {
                          content: '"✓"',
                          color: 'primary.main',
                          mr: 1
                        }
                      }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ mt: 'auto', pt: 2 }}>
                  <SubscriptionButton
                    userId={userId}
                    subscriptionType={plan.type}
                    label={`S'abonner`}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SubscriptionPlans; 