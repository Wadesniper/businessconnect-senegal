import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Tabs, Tab, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { useSubscription } from '../../hooks/useSubscription';
import { Formation } from '../../types/formation';
import { api } from '../../services/api';

const categories = [
  'tous',
  'développement',
  'business',
  'marketing',
  'design',
  'langues',
  'soft-skills'
];

const FormationsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { hasActiveSubscription } = useSubscription();

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await api.get(
          selectedCategory === 'tous' 
            ? '/formations'
            : `/formations/category/${selectedCategory}`
        );
        setFormations(response.data.data);
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, [selectedCategory]);

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const handleAccessFormation = async (formationId: string) => {
    try {
      if (!user) {
        // Rediriger vers la page de connexion
        window.location.href = '/auth/login?redirect=/formations';
        return;
      }

      if (!hasActiveSubscription) {
        // Rediriger vers la page d'abonnement
        window.location.href = '/subscription';
        return;
      }

      const response = await api.get(`/formations/${formationId}/access`);
      const { redirectUrl } = response.data.data;
      window.open(redirectUrl, '_blank');
    } catch (error) {
      console.error('Erreur lors de l\'accès à la formation:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom>
        Nos Formations
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Développez vos compétences avec nos formations en ligne de qualité
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              value={category}
            />
          ))}
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <Typography>Chargement des formations...</Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {formations.map((formation) => (
            <Grid item key={formation._id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={formation.thumbnail}
                  alt={formation.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {formation.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {formation.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip
                      label={`${formation.price.toLocaleString()} FCFA`}
                      color="primary"
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAccessFormation(formation._id)}
                    >
                      Accéder
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!hasActiveSubscription && (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Accédez à toutes nos formations
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Abonnez-vous pour profiter de l'ensemble de nos formations
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            href="/subscription"
          >
            Voir les abonnements
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default FormationsPage; 