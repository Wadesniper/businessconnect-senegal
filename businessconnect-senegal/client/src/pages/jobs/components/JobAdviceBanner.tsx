import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const JobAdviceBanner: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ backgroundColor: '#f5f5f5', py: 3, mb: 4 }}>
      <Container>
        <Typography variant="h5" gutterBottom>
          Conseils pour votre recherche d'emploi
        </Typography>
        <Typography variant="body1">
          Découvrez nos meilleurs conseils pour optimiser votre recherche d'emploi 
          et augmenter vos chances de décrocher le poste de vos rêves.
        </Typography>
      </Container>
    </Paper>
  );
};

export default JobAdviceBanner; 