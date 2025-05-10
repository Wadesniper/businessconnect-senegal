import React from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

const JobAdviceBanner: React.FC = () => {
  return (
    <Paper elevation={3} sx={{
      background: 'linear-gradient(90deg, #e3f2fd 0%, #fce4ec 100%)',
      py: { xs: 2, md: 3 },
      mb: 4,
      borderRadius: 3,
      boxShadow: 2,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      px: { xs: 2, md: 4 },
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TipsAndUpdatesIcon color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h5" gutterBottom fontWeight={700}>
            Conseils pour booster votre recherche d'emploi
          </Typography>
          <Typography variant="body1">
            Découvrez nos meilleurs conseils pour optimiser votre recherche et décrocher le poste de vos rêves.
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: { xs: 2, md: 0 } }}
        href="/blog/conseils-emploi"
      >
        Lire les conseils
      </Button>
    </Paper>
  );
};

export default JobAdviceBanner; 